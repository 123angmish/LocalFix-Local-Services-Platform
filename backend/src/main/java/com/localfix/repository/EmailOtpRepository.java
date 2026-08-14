package com.localfix.repository;

import com.localfix.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findTopByEmailOrderByCreatedAtDesc(String email);
    Optional<EmailOtp> findTopByEmailAndOtpCodeAndVerifiedFalseOrderByCreatedAtDesc(String email, String otpCode);
    void deleteByEmail(String email);
}
