package com.localfix.repository;

import com.localfix.model.WarrantyClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarrantyClaimRepository extends JpaRepository<WarrantyClaim, Long> {
    List<WarrantyClaim> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<WarrantyClaim> findByWarrantyVendorIdOrderByCreatedAtDesc(Long vendorId);
    List<WarrantyClaim> findByStatus(String status);
}
