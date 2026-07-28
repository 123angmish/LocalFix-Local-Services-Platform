package com.localfix.repository;

import com.localfix.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
    List<Review> findByBookingServiceIdOrderByCreatedAtDesc(Long serviceId);
    boolean existsByBookingId(Long bookingId);
}
