package com.localfix.controller;

import com.localfix.dto.review.CreateReviewRequest;
import com.localfix.dto.review.ReviewDto;
import com.localfix.security.UserPrincipal;
import com.localfix.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Endpoints for customer ratings and reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Submit a review for completed booking")
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(principal.getId(), request));
    }

    @GetMapping("/service/{serviceId}")
    @Operation(summary = "Get reviews for a service")
    public ResponseEntity<List<ReviewDto>> getReviewsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsByService(serviceId));
    }

    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get reviews for a vendor")
    public ResponseEntity<List<ReviewDto>> getReviewsByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(reviewService.getReviewsByVendor(vendorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remove inappropriate review (Admin only)")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
