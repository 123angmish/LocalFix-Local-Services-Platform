package com.localfix.repository;

import com.localfix.model.Warranty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    List<Warranty> findByCustomerIdOrderByEndDateAsc(Long customerId);
    List<Warranty> findByVendorIdOrderByEndDateAsc(Long vendorId);
    Optional<Warranty> findByBookingId(Long bookingId);
}
