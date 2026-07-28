package com.localfix.controller;

import com.localfix.dto.payment.DummyPaymentRequest;
import com.localfix.model.Payment;
import com.localfix.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Endpoints for dummy payment processing")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/dummy")
    @Operation(summary = "Process dummy payment for a booking")
    public ResponseEntity<Payment> processDummyPayment(@Valid @RequestBody DummyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.processDummyPayment(request));
    }
}
