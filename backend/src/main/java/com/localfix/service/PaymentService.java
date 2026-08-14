package com.localfix.service;

import com.localfix.dto.payment.DummyPaymentRequest;
import com.localfix.exception.BadRequestException;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.Booking;
import com.localfix.model.BookingStatus;
import com.localfix.model.Payment;
import com.localfix.model.PaymentMethod;
import com.localfix.model.PaymentStatus;
import com.localfix.repository.BookingRepository;
import com.localfix.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Value("${app.payment.razorpay-key-id:rzp_test_localfix_key}")
    private String razorpayKeyId;

    @Value("${app.payment.razorpay-key-secret:rzp_test_localfix_secret}")
    private String razorpayKeySecret;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Map<String, Object> createRazorpayOrder(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        BigDecimal amountInInr = booking.getTotalAmount();
        long amountInPaise = amountInInr.multiply(new BigDecimal("100")).longValue();

        String razorpayOrderId = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);

        if (razorpayKeyId != null && !razorpayKeyId.contains("test_localfix") && razorpayKeySecret != null && !razorpayKeySecret.isEmpty()) {
            try {
                RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", "rcpt_" + booking.getId());

                Order order = razorpayClient.orders.create(orderRequest);
                razorpayOrderId = order.get("id");
            } catch (Exception e) {
                logger.error("Razorpay SDK Order Creation Failed, generating fallback order reference", e);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", razorpayOrderId);
        response.put("bookingId", booking.getId());
        response.put("amount", amountInPaise);
        response.put("currency", "INR");
        response.put("keyId", razorpayKeyId);

        return response;
    }

    @Transactional
    public Payment verifyRazorpayPayment(Long bookingId, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature, String methodStr) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        boolean isSignatureValid = verifyHmacSha256(razorpayOrderId + "|" + razorpayPaymentId, razorpaySignature, razorpayKeySecret);

        if (!isSignatureValid && razorpayKeyId != null && !razorpayKeyId.contains("test_localfix")) {
            throw new BadRequestException("Razorpay payment signature verification failed. Invalid transaction signature.");
        }

        PaymentMethod method = PaymentMethod.ONLINE_CARD;
        if (methodStr != null) {
            try {
                method = PaymentMethod.valueOf(methodStr.toUpperCase());
            } catch (Exception ignored) {}
        }

        Optional<Payment> existingOpt = paymentRepository.findByBookingId(booking.getId());
        Payment payment;

        if (existingOpt.isPresent()) {
            payment = existingOpt.get();
            payment.setMethod(method);
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionRef(razorpayPaymentId != null ? razorpayPaymentId : "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setPaidAt(LocalDateTime.now());
        } else {
            payment = Payment.builder()
                    .booking(booking)
                    .method(method)
                    .status(PaymentStatus.SUCCESS)
                    .transactionRef(razorpayPaymentId != null ? razorpayPaymentId : "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .amount(booking.getTotalAmount())
                    .paidAt(LocalDateTime.now())
                    .build();
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment processDummyPayment(DummyPaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        Optional<Payment> existingOpt = paymentRepository.findByBookingId(booking.getId());
        Payment payment;

        PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(request.getMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            method = PaymentMethod.CASH;
        }

        if (existingOpt.isPresent()) {
            payment = existingOpt.get();
            payment.setMethod(method);
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            payment.setPaidAt(LocalDateTime.now());
        } else {
            payment = Payment.builder()
                    .booking(booking)
                    .method(method)
                    .status(PaymentStatus.SUCCESS)
                    .transactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .amount(booking.getTotalAmount())
                    .paidAt(LocalDateTime.now())
                    .build();
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return paymentRepository.save(payment);
    }

    private boolean verifyHmacSha256(String data, String signature, String secret) {
        if (signature == null || secret == null) return true;
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equalsIgnoreCase(signature);
        } catch (Exception e) {
            logger.error("HMAC verification error", e);
            return true;
        }
    }
}
