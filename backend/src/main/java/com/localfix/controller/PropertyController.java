package com.localfix.controller;

import com.localfix.model.Property;
import com.localfix.security.UserPrincipal;
import com.localfix.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/properties")
@Tag(name = "Property Maintenance Passport", description = "Endpoints for saved property repair history and passport")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Add a new saved property")
    public ResponseEntity<Property> createProperty(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam String title,
            @RequestParam String address,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType) {
        return ResponseEntity.ok(propertyService.createProperty(principal.getId(), title, address, city, propertyType));
    }

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get user's saved properties")
    public ResponseEntity<List<Property>> getCustomerProperties(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(propertyService.getCustomerProperties(principal.getId()));
    }

    @GetMapping("/{id}/passport")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get property maintenance passport history")
    public ResponseEntity<Map<String, Object>> getPropertyPassport(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyPassport(id));
    }
}
