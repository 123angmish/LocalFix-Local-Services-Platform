package com.localfix.repository;

import com.localfix.model.Booking;
import com.localfix.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Booking> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
    List<Booking> findByVendorIdAndStatus(Long vendorId, BookingStatus status);
    List<Booking> findByStatus(BookingStatus status);
    long countByStatus(BookingStatus status);
    long countByVendorId(Long vendorId);
    long countByVendorIdAndStatus(Long vendorId, BookingStatus status);
}
