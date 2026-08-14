package com.localfix.service;

import com.localfix.dto.auth.*;
import com.localfix.exception.BadRequestException;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.*;
import com.localfix.repository.*;
import com.localfix.security.JwtTokenProvider;
import com.localfix.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final ServiceRepository serviceRepository;
    private final EmailOtpRepository emailOtpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    private static final SecureRandom random = new SecureRandom();

    public AuthService(UserRepository userRepository, VendorProfileRepository vendorProfileRepository, ServiceCategoryRepository categoryRepository, ServiceRepository serviceRepository, EmailOtpRepository emailOtpRepository, EmailService emailService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.vendorProfileRepository = vendorProfileRepository;
        this.categoryRepository = categoryRepository;
        this.serviceRepository = serviceRepository;
        this.emailOtpRepository = emailOtpRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public String sendRegistrationOtp(String email, String role, String userName) {
        if (email == null || !email.contains("@")) {
            throw new BadRequestException("Please provide a valid email address");
        }

        Optional<EmailOtp> existingOpt = emailOtpRepository.findTopByEmailOrderByCreatedAtDesc(email);
        if (existingOpt.isPresent()) {
            EmailOtp existing = existingOpt.get();
            if (existing.getCreatedAt().plusSeconds(30).isAfter(LocalDateTime.now())) {
                throw new BadRequestException("Please wait 30 seconds before requesting another OTP");
            }
        }

        String otpCode = String.format("%06d", random.nextInt(900000) + 100000);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

        EmailOtp otp = new EmailOtp(email, otpCode, role != null ? role : "CUSTOMER", "", expiresAt);
        emailOtpRepository.save(otp);

        emailService.sendOtpEmail(email, otpCode, userName);
        return "📩 6-Digit Verification OTP sent to " + email + "! (OTP Code: " + otpCode + ")";
    }

    @Transactional
    public boolean verifyRegistrationOtp(String email, String otpCode) {
        Optional<EmailOtp> otpOpt = emailOtpRepository.findTopByEmailAndOtpCodeAndVerifiedFalseOrderByCreatedAtDesc(email, otpCode);

        if (otpOpt.isEmpty()) {
            throw new BadRequestException("Invalid OTP Code for email: " + email);
        }

        EmailOtp otp = otpOpt.get();

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP Code has expired. Please request a new verification code.");
        }

        if (otp.getAttemptCount() >= 5) {
            throw new BadRequestException("Maximum OTP verification attempts exceeded. Request a new OTP.");
        }

        otp.setVerified(true);
        emailOtpRepository.save(otp);
        return true;
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserDto(user))
                .build();
    }

    @Transactional
    public AuthResponse loginWithGoogle(String email, String name, String roleStr) {
        Role targetRole = "VENDOR".equalsIgnoreCase(roleStr) ? Role.VENDOR : Role.CUSTOMER;
        Optional<User> userOpt = userRepository.findByEmail(email);

        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            String randomPass = UUID.randomUUID().toString();
            user = User.builder()
                    .name(name != null ? name : "Google User")
                    .email(email)
                    .password(passwordEncoder.encode(randomPass))
                    .phone("+91 9876543210")
                    .role(targetRole)
                    .enabled(true)
                    .build();

            user = userRepository.save(user);

            if (targetRole == Role.VENDOR) {
                VendorProfile vendorProfile = VendorProfile.builder()
                        .user(user)
                        .businessName(user.getName() + " Services")
                        .description("Professional verified Google partner services.")
                        .city("Mumbai")
                        .address("Local Area")
                        .approved(true)
                        .rating(5.0)
                        .totalReviews(1)
                        .build();
                vendorProfileRepository.save(vendorProfile);
            }
        }

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserDto(user))
                .build();
    }

    @Transactional
    public AuthResponse registerCustomer(RegisterCustomerRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        userRepository.save(user);

        return login(new AuthRequest(request.getEmail(), request.getPassword()));
    }

    @Transactional
    public AuthResponse registerVendor(RegisterVendorRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.VENDOR)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        VendorProfile vendorProfile = VendorProfile.builder()
                .user(savedUser)
                .businessName(request.getBusinessName() != null ? request.getBusinessName() : request.getProfessionTitle() + " Service")
                .description(request.getDescription() != null ? request.getDescription() : "Professional " + request.getProfessionTitle() + " services.")
                .city(request.getCity())
                .address(request.getAddress())
                .approved(true)
                .rating(5.0)
                .totalReviews(1)
                .build();

        VendorProfile savedVendor = vendorProfileRepository.save(vendorProfile);

        String categoryName = determineCategoryName(request.getProfessionTitle());
        ServiceCategory category = categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseGet(() -> categoryRepository.save(ServiceCategory.builder()
                        .name(categoryName)
                        .description("Professional " + categoryName + " services.")
                        .icon("Wrench")
                        .build()));

        BigDecimal servicePrice = request.getPrice() != null ? request.getPrice() : new BigDecimal("200");
        ServiceItem item = ServiceItem.builder()
                .vendor(savedVendor)
                .category(category)
                .title(request.getProfessionTitle())
                .description(request.getDescription() != null ? request.getDescription() : "Expert " + request.getProfessionTitle() + " services at your doorstep.")
                .price(servicePrice)
                .city(request.getCity())
                .durationMinutes(60)
                .active(true)
                .build();

        serviceRepository.save(item);

        return login(new AuthRequest(request.getEmail(), request.getPassword()));
    }

    private String determineCategoryName(String title) {
        if (title == null) return "General";
        String lower = title.toLowerCase();
        if (lower.contains("barber") || lower.contains("hair") || lower.contains("salon") || lower.contains("beauty")) return "Salon";
        if (lower.contains("plumb") || lower.contains("leak") || lower.contains("pipe") || lower.contains("tap")) return "Plumber";
        if (lower.contains("electr") || lower.contains("wire") || lower.contains("switch")) return "Electrician";
        if (lower.contains("clean") || lower.contains("maid") || lower.contains("wash")) return "Cleaner";
        if (lower.contains("tutor") || lower.contains("teacher") || lower.contains("teach")) return "Tutor";
        if (lower.contains("appliance") || lower.contains("ac") || lower.contains("fridge")) return "Appliance Repair";
        return title;
    }

    public AuthResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    UserPrincipal principal = UserPrincipal.create(user);
                    Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                    String token = tokenProvider.generateToken(authentication);
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                    return AuthResponse.builder()
                            .token(token)
                            .refreshToken(newRefreshToken.getToken())
                            .user(mapToUserDto(user))
                            .build();
                })
                .orElseThrow(() -> new BadRequestException("Refresh token is not in database!"));
    }

    public UserDto getCurrentUserDto(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserDto(user);
    }

    public UserDto mapToUserDto(User user) {
        UserDto.UserDtoBuilder builder = UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt());

        if (user.getRole() == Role.VENDOR) {
            Optional<VendorProfile> profileOpt = vendorProfileRepository.findByUserId(user.getId());
            profileOpt.ifPresent(profile -> {
                builder.vendorProfileId(profile.getId());
                builder.businessName(profile.getBusinessName());
                builder.approved(profile.isApproved());
            });
        }

        return builder.build();
    }
}
