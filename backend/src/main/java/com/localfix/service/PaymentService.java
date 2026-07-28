package com.localfix.service;

import com.localfix.dto.payment.DummyPaymentRequest;
import com.localfix.exception.BadRequestException;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.Booking;
import com.localfix.model.Payment;
import com.localfix.model.PaymentMethod;
import com.localfix.model.PaymentStatus;
import com.localfix.repository.BookingRepository;
import com.localfix.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
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
            throw new BadRequestException("Invalid payment method: " + request.getMethod());
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

        return paymentRepository.save(payment);
    }
}
