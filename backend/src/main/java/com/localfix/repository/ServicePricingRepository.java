package com.localfix.repository;

import com.localfix.model.ServicePricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServicePricingRepository extends JpaRepository<ServicePricing, Long> {
    List<ServicePricing> findByCategoryId(Long categoryId);
    Optional<ServicePricing> findByCategoryIdAndJobTypeContainingIgnoreCase(Long categoryId, String jobType);
}
