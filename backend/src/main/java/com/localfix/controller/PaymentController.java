package com.localfix.controller;

import com.localfix.dto.payment.DummyPaymentRequest;
import com.localfix.model.Payment;
import com.localfix.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Endpoints for Razorpay payment processing and verification")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    @Operation(summary = "Create Razorpay Order for a booking")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestParam Long bookingId) {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(bookingId));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment signature and confirm booking")
    public ResponseEntity<Payment> verifyPayment(@RequestBody Map<String, String> payload) {
        Long bookingId = Long.parseLong(payload.get("bookingId"));
        String razorpayOrderId = payload.get("razorpay_order_id");
        String razorpayPaymentId = payload.get("razorpay_payment_id");
        String razorpaySignature = payload.get("razorpay_signature");
        String method = payload.getOrDefault("method", "UPI");

        return ResponseEntity.ok(paymentService.verifyRazorpayPayment(bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature, method));
    }

    @PostMapping("/dummy")
    @Operation(summary = "Process dummy or Cash on Delivery payment for a booking")
    public ResponseEntity<Payment> processDummyPayment(@Valid @RequestBody DummyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.processDummyPayment(request));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay Webhook listener for payment captured/failed events")
    public ResponseEntity<String> handleWebhook(@RequestBody String webhookBody, @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        return ResponseEntity.ok("Webhook received successfully");
    }
}
