package com.localfix.controller;

import com.localfix.dto.service.ServiceCreateUpdateDto;
import com.localfix.dto.service.ServiceDto;
import com.localfix.security.UserPrincipal;
import com.localfix.service.ServiceItemService;
import com.localfix.util.LocationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@Tag(name = "Services", description = "Endpoints for service browsing, nearby vendor Haversine distance search, and vendor service CRUD")
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

    @GetMapping("/vendors/nearby")
    @Operation(summary = "Get nearby verified vendor services based on Haversine distance coordinates (in KM)")
    public ResponseEntity<List<ServiceDto>> getNearbyVendors(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "25.0") double radiusKm,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String sortBy
    ) {
        List<ServiceDto> allServices = serviceItemService.searchServices(category, null, null, null, null, null);

        // Calculate Haversine distance for each service
        List<ServiceDto> nearby = allServices.stream().peek(srv -> {
            double vLat = srv.getVendorLat() != null ? srv.getVendorLat() : 19.0760;
            double vLng = srv.getVendorLng() != null ? srv.getVendorLng() : 72.8777;
            double dist = LocationUtil.calculateDistanceKm(lat, lng, vLat, vLng);
            srv.setDistanceKm(Math.round(dist * 10.0) / 10.0);
        }).filter(srv -> srv.getDistanceKm() <= radiusKm).collect(Collectors.toList());

        if ("price-low".equalsIgnoreCase(sortBy)) {
            nearby.sort(Comparator.comparing(ServiceDto::getPrice));
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            nearby.sort((a, b) -> Double.compare(b.getVendorRating() != null ? b.getVendorRating() : 0.0, a.getVendorRating() != null ? a.getVendorRating() : 0.0));
        } else {
            nearby.sort(Comparator.comparing(ServiceDto::getDistanceKm));
        }

        return ResponseEntity.ok(nearby);
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
