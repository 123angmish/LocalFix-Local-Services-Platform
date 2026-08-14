package com.localfix.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_otps")
public class EmailOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otpCode;

    @Column(nullable = false)
    private String role; // CUSTOMER or VENDOR

    @Column(length = 1000)
    private String registrationDataJson; // Stores JSON payload for pending account creation

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private boolean verified = false;

    private int attemptCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    public EmailOtp() {}

    public EmailOtp(String email, String otpCode, String role, String registrationDataJson, LocalDateTime expiresAt) {
        this.email = email;
        this.otpCode = otpCode;
        this.role = role;
        this.registrationDataJson = registrationDataJson;
        this.expiresAt = expiresAt;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getRegistrationDataJson() { return registrationDataJson; }
    public void setRegistrationDataJson(String registrationDataJson) { this.registrationDataJson = registrationDataJson; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public int getAttemptCount() { return attemptCount; }
    public void setAttemptCount(int attemptCount) { this.attemptCount = attemptCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
