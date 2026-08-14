package com.localfix.controller;

import com.localfix.dto.auth.*;
import com.localfix.security.UserPrincipal;
import com.localfix.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for User and Vendor Login, Gmail OTP & Registration")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send 6-digit registration OTP to Gmail address")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String role = request.getOrDefault("role", "CUSTOMER");
        String name = request.get("name");
        String msg = authService.sendRegistrationOtp(email, role, name);
        return ResponseEntity.ok(Map.of("message", msg, "email", email));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify 6-digit registration OTP")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        boolean verified = authService.verifyRegistrationOtp(email, otp);
        return ResponseEntity.ok(Map.of("verified", verified, "message", "Gmail OTP verified successfully"));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user or vendor")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register/customer")
    @Operation(summary = "Register a new customer")
    public ResponseEntity<AuthResponse> registerCustomer(@Valid @RequestBody RegisterCustomerRequest request) {
        return ResponseEntity.ok(authService.registerCustomer(request));
    }

    @PostMapping("/register/vendor")
    @Operation(summary = "Register a new vendor")
    public ResponseEntity<AuthResponse> registerVendor(@Valid @RequestBody RegisterVendorRequest request) {
        return ResponseEntity.ok(authService.registerVendor(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT authentication token")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(authService.getCurrentUserDto(principal));
    }
}
