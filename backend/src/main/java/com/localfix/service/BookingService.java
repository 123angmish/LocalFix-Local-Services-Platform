package com.localfix.service;

import com.localfix.dto.booking.BookingDto;
import com.localfix.dto.booking.CreateBookingRequest;
import com.localfix.exception.BadRequestException;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.*;
import com.localfix.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, ServiceRepository serviceRepository, PaymentRepository paymentRepository, ReviewRepository reviewRepository, NotificationRepository notificationRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.paymentRepository = paymentRepository;
        this.reviewRepository = reviewRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public BookingDto createBooking(Long customerUserId, CreateBookingRequest request) {
        User customer = userRepository.findById(customerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerUserId));

        ServiceItem service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + request.getServiceId()));

        if (!service.isActive()) {
            throw new BadRequestException("This service is currently inactive");
        }

        VendorProfile vendor = service.getVendor();
        if (!vendor.isApproved()) {
            vendor.setApproved(true);
        }

        BigDecimal basePrice = service.getPrice();
        BigDecimal discount = BigDecimal.ZERO;
        String promoCodeApplied = null;

        if (request.getPromoCode() != null && !request.getPromoCode().trim().isEmpty()) {
            String code = request.getPromoCode().trim().toUpperCase();
            if ("FIRSTFIX10".equals(code)) {
                discount = basePrice.multiply(new BigDecimal("0.10"));
                promoCodeApplied = "FIRSTFIX10";
            } else if ("SUPERHOME20".equals(code)) {
                discount = basePrice.multiply(new BigDecimal("0.20"));
                promoCodeApplied = "SUPERHOME20";
            } else if ("WELCOME50".equals(code)) {
                discount = new BigDecimal("50.00");
                promoCodeApplied = "WELCOME50";
            }
            if (discount.compareTo(basePrice) > 0) {
                discount = basePrice;
            }
        }

        BigDecimal finalPrice = basePrice.subtract(discount);
        String otpCode = generateSecureOtp();

        Booking booking = Booking.builder()
                .customer(customer)
                .vendor(vendor)
                .service(service)
                .bookingDate(request.getBookingDate())
                .timeSlot(request.getTimeSlot())
                .address(request.getAddress())
                .notes(request.getNotes())
                .status(BookingStatus.PENDING)
                .totalAmount(finalPrice)
                .discountAmount(discount)
                .promoCode(promoCodeApplied)
                .verificationCode(otpCode)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        if (request.getPaymentMethod() != null && !request.getPaymentMethod().trim().isEmpty()) {
            PaymentMethod method;
            try {
                method = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
            } catch (IllegalArgumentException e) {
                method = PaymentMethod.CASH;
            }

            Payment payment = Payment.builder()
                    .booking(savedBooking)
                    .method(method)
                    .status(method == PaymentMethod.CASH ? PaymentStatus.PENDING : PaymentStatus.SUCCESS)
                    .transactionRef("TXN-" + System.currentTimeMillis())
                    .amount(finalPrice)
                    .paidAt(method == PaymentMethod.CASH ? null : LocalDateTime.now())
                    .build();

            paymentRepository.save(payment);
        }

        notificationRepository.save(Notification.builder()
                .user(vendor.getUser())
                .title("New Booking Received")
                .message("You have a new booking request for " + service.getTitle() + " on " + request.getBookingDate())
                .isRead(false)
                .build());

        return mapToDto(savedBooking);
    }

    public List<BookingDto> getCustomerBookings(Long customerUserId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerUserId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<BookingDto> getVendorBookings(Long vendorUserId) {
        VendorProfile vendor = serviceRepository.findByVendorId(vendorUserId).stream()
                .map(ServiceItem::getVendor)
                .findFirst()
                .orElse(null);

        if (vendor == null) {
            return bookingRepository.findAll().stream()
                    .filter(b -> b.getVendor().getUser().getId().equals(vendorUserId))
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }

        return bookingRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDto updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(newStatus);
        if (newStatus == BookingStatus.IN_PROGRESS && booking.getStartedAt() == null) {
            booking.setStartedAt(LocalDateTime.now());
        } else if (newStatus == BookingStatus.COMPLETED) {
            booking.setCompletedAt(LocalDateTime.now());
        }

        Booking updated = bookingRepository.save(booking);

        notificationRepository.save(Notification.builder()
                .user(booking.getCustomer())
                .title("Booking Status Updated")
                .message("Your booking #" + booking.getId() + " status changed to: " + newStatus)
                .isRead(false)
                .build());

        return mapToDto(updated);
    }

    @Transactional
    public BookingDto verifyAndTransitionStatus(Long bookingId, BookingStatus targetStatus, String otp) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getVerificationCode() != null && !booking.getVerificationCode().equals(otp.trim())) {
            throw new BadRequestException("Invalid 4-digit verification code. Please check with customer.");
        }

        return updateBookingStatus(bookingId, targetStatus);
    }

    @Transactional
    public BookingDto cancelBookingByCustomer(Long customerUserId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getCustomer().getId().equals(customerUserId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel booking with current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return mapToDto(bookingRepository.save(booking));
    }

    private static final java.security.SecureRandom secureRandom = new java.security.SecureRandom();

    public String generateSecureOtp() {
        return String.format("%04d", 1000 + secureRandom.nextInt(9000));
    }

    @Transactional
    public BookingDto regenerateCustomerOtp(Long customerUserId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getCustomer().getId().equals(customerUserId)) {
            throw new BadRequestException("You can only regenerate OTP for your own booking");
        }

        String freshOtp = generateSecureOtp();
        booking.setVerificationCode(freshOtp);
        return mapToDto(bookingRepository.save(booking));
    }

    public BookingDto mapToDto(Booking booking) {
        Optional<Payment> paymentOpt = paymentRepository.findByBookingId(booking.getId());
        boolean isReviewed = reviewRepository.existsByBookingId(booking.getId());

        return BookingDto.builder()
                .id(booking.getId())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getName())
                .customerEmail(booking.getCustomer().getEmail())
                .customerPhone(booking.getCustomer().getPhone())
                .vendorId(booking.getVendor().getId())
                .vendorBusinessName(booking.getVendor().getBusinessName())
                .vendorPhone(booking.getVendor().getUser().getPhone())
                .serviceId(booking.getService().getId())
                .serviceTitle(booking.getService().getTitle())
                .categoryName(booking.getService().getCategory().getName())
                .bookingDate(booking.getBookingDate())
                .timeSlot(booking.getTimeSlot())
                .address(booking.getAddress())
                .notes(booking.getNotes())
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .paymentMethod(paymentOpt.map(p -> p.getMethod().name()).orElse("PENDING"))
                .paymentStatus(paymentOpt.map(p -> p.getStatus().name()).orElse("PENDING"))
                .reviewed(isReviewed)
                .verificationCode(booking.getVerificationCode())
                .discountAmount(booking.getDiscountAmount())
                .promoCode(booking.getPromoCode())
                .startedAt(booking.getStartedAt())
                .completedAt(booking.getCompletedAt())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
