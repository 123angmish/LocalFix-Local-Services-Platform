package com.localfix.controller;

import com.localfix.security.UserPrincipal;
import com.localfix.service.SOSService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/sos")
@Tag(name = "LocalFix SOS Emergency", description = "Endpoints for emergency priority technician dispatch")
public class SOSController {

    private final SOSService sosService;

    public SOSController(SOSService sosService) {
        this.sosService = sosService;
    }

    @PostMapping("/dispatch")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Trigger emergency SOS priority dispatch")
    public ResponseEntity<Map<String, Object>> triggerSOS(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String issueCategory,
            @RequestParam String address,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(sosService.triggerEmergencySOS(principal.getId(), issueCategory, address, notes));
    }
}
