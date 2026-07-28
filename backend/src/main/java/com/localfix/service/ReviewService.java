package com.localfix.service;

import com.localfix.dto.review.CreateReviewRequest;
import com.localfix.dto.review.ReviewDto;
import com.localfix.exception.BadRequestException;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.Booking;
import com.localfix.model.BookingStatus;
import com.localfix.model.Review;
import com.localfix.model.VendorProfile;
import com.localfix.repository.BookingRepository;
import com.localfix.repository.ReviewRepository;
import com.localfix.repository.VendorProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final VendorProfileRepository vendorProfileRepository;

    public ReviewService(ReviewRepository reviewRepository, BookingRepository bookingRepository, VendorProfileRepository vendorProfileRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.vendorProfileRepository = vendorProfileRepository;
    }

    @Transactional
    public ReviewDto createReview(Long customerUserId, CreateReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (!booking.getCustomer().getId().equals(customerUserId)) {
            throw new BadRequestException("You can only review your own bookings");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("You can only review completed bookings");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("This booking has already been reviewed");
        }

        Review review = Review.builder()
                .booking(booking)
                .customer(booking.getCustomer())
                .vendor(booking.getVendor())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        VendorProfile vendor = booking.getVendor();
        List<Review> vendorReviews = reviewRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());
        double avgRating = vendorReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
        vendor.setRating(Math.round(avgRating * 10.0) / 10.0);
        vendor.setTotalReviews(vendorReviews.size());
        vendorProfileRepository.save(vendor);

        return mapToDto(savedReview);
    }

    public List<ReviewDto> getReviewsByService(Long serviceId) {
        return reviewRepository.findByBookingServiceIdOrderByCreatedAtDesc(serviceId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReviewDto> getReviewsByVendor(Long vendorId) {
        return reviewRepository.findByVendorIdOrderByCreatedAtDesc(vendorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        reviewRepository.delete(review);
    }

    public ReviewDto mapToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .vendorId(review.getVendor().getId())
                .vendorBusinessName(review.getVendor().getBusinessName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
