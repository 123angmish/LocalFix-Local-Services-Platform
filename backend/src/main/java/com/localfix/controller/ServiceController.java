package com.localfix.controller;

import com.localfix.dto.service.ServiceCreateUpdateDto;
import com.localfix.dto.service.ServiceDto;
import com.localfix.security.UserPrincipal;
import com.localfix.service.ServiceItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Services", description = "Endpoints for service browsing, vendor service management, and profession reset")
public class ServiceController {

    private final ServiceItemService serviceItemService;

    public ServiceController(ServiceItemService serviceItemService) {
        this.serviceItemService = serviceItemService;
    }

    @GetMapping("/services")
    @Operation(summary = "Search and filter services")
    public ResponseEntity<List<ServiceDto>> searchServices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating
    ) {
        return ResponseEntity.ok(serviceItemService.searchServices(keyword, categoryId, city, minPrice, maxPrice, minRating));
    }

    @GetMapping("/services/{id}")
    @Operation(summary = "Get service by ID")
    public ResponseEntity<ServiceDto> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceItemService.getServiceById(id));
    }

    @GetMapping("/vendor/services")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Get services created by current vendor")
    public ResponseEntity<List<ServiceDto>> getMyServices(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(serviceItemService.getServicesByVendorUserId(principal.getId()));
    }

    @PostMapping("/vendor/services")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Create a new service (Vendor)")
    public ResponseEntity<ServiceDto> createService(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ServiceCreateUpdateDto dto) {
        return ResponseEntity.ok(serviceItemService.createService(principal.getId(), dto));
    }

    @PutMapping("/vendor/services/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Update vendor service")
    public ResponseEntity<ServiceDto> updateService(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ServiceCreateUpdateDto dto) {
        return ResponseEntity.ok(serviceItemService.updateService(principal.getId(), id, dto));
    }

    @DeleteMapping("/vendor/services/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Delete vendor service")
    public ResponseEntity<Void> deleteService(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        serviceItemService.deleteService(principal.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/vendor/profession/reset")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Reset / hard delete all previous profession data for vendor from SQL database")
    public ResponseEntity<Void> resetVendorProfession(@AuthenticationPrincipal UserPrincipal principal) {
        serviceItemService.resetVendorProfession(principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/services/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle active status of service (Admin)")
    public ResponseEntity<ServiceDto> toggleServiceStatus(@PathVariable Long id) {
        return ResponseEntity.ok(serviceItemService.toggleServiceStatus(id));
    }
}
