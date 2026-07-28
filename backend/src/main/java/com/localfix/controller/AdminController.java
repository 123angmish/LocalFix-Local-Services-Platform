package com.localfix.controller;

import com.localfix.dto.auth.UserDto;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.VendorProfile;
import com.localfix.repository.UserRepository;
import com.localfix.repository.VendorProfileRepository;
import com.localfix.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Management", description = "Endpoints for managing users and approving vendors")
public class AdminController {

    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final AuthService authService;

    public AdminController(UserRepository userRepository, VendorProfileRepository vendorProfileRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.vendorProfileRepository = vendorProfileRepository;
        this.authService = authService;
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (Admin)")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(authService::mapToUserDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/vendors")
    @Operation(summary = "Get all vendors (Admin)")
    public ResponseEntity<List<VendorProfile>> getAllVendors() {
        return ResponseEntity.ok(vendorProfileRepository.findAll());
    }

    @PatchMapping("/vendors/{id}/approve")
    @Operation(summary = "Approve vendor application")
    public ResponseEntity<VendorProfile> approveVendor(@PathVariable Long id) {
        VendorProfile vendor = vendorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found with id: " + id));
        vendor.setApproved(true);
        return ResponseEntity.ok(vendorProfileRepository.save(vendor));
    }

    @PatchMapping("/vendors/{id}/reject")
    @Operation(summary = "Reject vendor application")
    public ResponseEntity<VendorProfile> rejectVendor(@PathVariable Long id) {
        VendorProfile vendor = vendorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found with id: " + id));
        vendor.setApproved(false);
        return ResponseEntity.ok(vendorProfileRepository.save(vendor));
    }
}
