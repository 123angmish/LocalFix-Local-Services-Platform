package com.localfix.controller;

import com.localfix.dto.booking.BookingDto;
import com.localfix.dto.booking.CreateBookingRequest;
import com.localfix.model.BookingStatus;
import com.localfix.security.UserPrincipal;
import com.localfix.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Bookings", description = "Endpoints for booking services, vendor management, and status updates")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/bookings")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'VENDOR')")
    @Operation(summary = "Create a service booking")
    public ResponseEntity<BookingDto> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateBookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(principal.getId(), request));
    }

    @GetMapping("/customer/bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get current customer bookings")
    public ResponseEntity<List<BookingDto>> getCustomerBookings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(principal.getId()));
    }

    @GetMapping("/vendor/bookings")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Get incoming bookings for current vendor")
    public ResponseEntity<List<BookingDto>> getVendorBookings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getVendorBookings(principal.getId()));
    }

    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all system bookings (Admin)")
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/vendor/bookings/{id}/accept")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Accept booking (Vendor)")
    public ResponseEntity<BookingDto> acceptBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.ACCEPTED));
    }

    @PatchMapping("/vendor/bookings/{id}/reject")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Reject booking (Vendor)")
    public ResponseEntity<BookingDto> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.REJECTED));
    }

    @PatchMapping("/vendor/bookings/{id}/in-progress")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Mark booking as in progress (Vendor)")
    public ResponseEntity<BookingDto> markInProgress(
            @PathVariable Long id,
            @RequestParam(required = false) String otp) {
        if (otp != null && !otp.trim().isEmpty()) {
            return ResponseEntity.ok(bookingService.verifyAndTransitionStatus(id, BookingStatus.IN_PROGRESS, otp));
        }
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.IN_PROGRESS));
    }

    @PatchMapping("/vendor/bookings/{id}/complete")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Mark booking as completed (Vendor)")
    public ResponseEntity<BookingDto> markCompleted(
            @PathVariable Long id,
            @RequestParam(required = false) String otp) {
        if (otp != null && !otp.trim().isEmpty()) {
            return ResponseEntity.ok(bookingService.verifyAndTransitionStatus(id, BookingStatus.COMPLETED, otp));
        }
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.COMPLETED));
    }

    @PatchMapping("/customer/bookings/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Cancel booking (Customer)")
    public ResponseEntity<BookingDto> cancelBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBookingByCustomer(principal.getId(), id));
    }
}
