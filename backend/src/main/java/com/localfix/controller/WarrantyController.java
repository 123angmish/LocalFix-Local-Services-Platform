package com.localfix.controller;

import com.localfix.model.Warranty;
import com.localfix.model.WarrantyClaim;
import com.localfix.security.UserPrincipal;
import com.localfix.service.WarrantyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class WarrantyController {

    @Autowired
    private WarrantyService warrantyService;

    @GetMapping("/customer/warranties")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Warranty>> getCustomerWarranties(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(warrantyService.getCustomerWarranties(currentUser.getId()));
    }

    @PostMapping("/customer/warranties/{id}/claims")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<WarrantyClaim> raiseWarrantyClaim(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> payload
    ) {
        String issueDescription = payload.get("issueDescription");
        return ResponseEntity.ok(warrantyService.raiseWarrantyClaim(id, currentUser.getId(), issueDescription));
    }

    @GetMapping("/customer/warranty-claims")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<WarrantyClaim>> getCustomerWarrantyClaims(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(warrantyService.getCustomerWarrantyClaims(currentUser.getId()));
    }
}
