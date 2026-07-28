package com.localfix.controller;

import com.localfix.security.UserPrincipal;
import com.localfix.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/subscriptions")
@Tag(name = "FixPass Subscriptions", description = "Endpoints for FixPass membership plans")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/plans")
    @Operation(summary = "Get available FixPass membership plans")
    public ResponseEntity<List<Map<String, Object>>> getPlans() {
        return ResponseEntity.ok(subscriptionService.getPlans());
    }

    @PostMapping("/subscribe/{planId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Subscribe to a FixPass plan")
    public ResponseEntity<Map<String, Object>> subscribe(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long planId) {
        return ResponseEntity.ok(subscriptionService.subscribe(principal.getId(), planId));
    }
}
