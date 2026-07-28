package com.localfix.repository;

import com.localfix.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Quote> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
}
