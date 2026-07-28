package com.localfix.controller;

import com.localfix.dto.dashboard.AdminDashboardStats;
import com.localfix.dto.dashboard.CustomerDashboardStats;
import com.localfix.dto.dashboard.VendorDashboardStats;
import com.localfix.security.UserPrincipal;
import com.localfix.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Dashboards", description = "Endpoints for Admin, Vendor, and Customer Dashboard metrics")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard statistics")
    public ResponseEntity<AdminDashboardStats> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/vendor/dashboard")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Get vendor dashboard statistics")
    public ResponseEntity<VendorDashboardStats> getVendorDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getVendorDashboardStats(principal.getId()));
    }

    @GetMapping("/customer/dashboard")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get customer dashboard statistics")
    public ResponseEntity<CustomerDashboardStats> getCustomerDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getCustomerDashboardStats(principal.getId()));
    }
}
