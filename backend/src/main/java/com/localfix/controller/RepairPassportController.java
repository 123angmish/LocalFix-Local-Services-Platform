package com.localfix.controller;

import com.localfix.model.Appliance;
import com.localfix.model.RepairPassport;
import com.localfix.security.UserPrincipal;
import com.localfix.service.RepairPassportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/passport")
public class RepairPassportController {

    @Autowired
    private RepairPassportService passportService;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Map<String, Object>> getPassportSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(passportService.getCustomerRepairPassportSummary(currentUser.getId()));
    }

    @PostMapping("/appliances")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Appliance> registerAppliance(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, Object> payload
    ) {
        String name = (String) payload.get("name");
        String brand = (String) payload.get("brand");
        String model = (String) payload.get("model");
        Integer purchaseYear = payload.get("purchaseYear") != null ? Integer.parseInt(payload.get("purchaseYear").toString()) : null;
        String serialNumber = (String) payload.get("serialNumber");

        return ResponseEntity.ok(passportService.registerAppliance(currentUser.getId(), name, brand, model, purchaseYear, serialNumber));
    }

    @GetMapping("/appliances")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Appliance>> getAppliances(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(passportService.getCustomerAppliances(currentUser.getId()));
    }

    @PostMapping("/entries")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<RepairPassport> addPassportEntry(@RequestBody Map<String, Object> payload) {
        Long applianceId = Long.parseLong(payload.get("applianceId").toString());
        Long bookingId = payload.get("bookingId") != null ? Long.parseLong(payload.get("bookingId").toString()) : null;
        String diagnosisSummary = (String) payload.get("diagnosisSummary");
        String workSummary = (String) payload.get("workSummary");
        BigDecimal totalSpent = payload.get("totalSpent") != null ? new BigDecimal(payload.get("totalSpent").toString()) : BigDecimal.ZERO;
        Integer partsCount = payload.get("partsCount") != null ? Integer.parseInt(payload.get("partsCount").toString()) : 0;

        return ResponseEntity.ok(passportService.addPassportEntry(applianceId, bookingId, diagnosisSummary, workSummary, totalSpent, partsCount));
    }

    @GetMapping("/appliances/{id}/history")
    public ResponseEntity<List<RepairPassport>> getApplianceHistory(@PathVariable Long id) {
        return ResponseEntity.ok(passportService.getApplianceHistory(id));
    }
}
