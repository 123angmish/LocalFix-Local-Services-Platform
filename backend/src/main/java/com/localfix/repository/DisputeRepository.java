package com.localfix.repository;

import com.localfix.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByRaisedByIdOrderByCreatedAtDesc(Long user_id);
    List<Dispute> findByBookingVendorIdOrderByCreatedAtDesc(Long vendor_id);
    List<Dispute> findByStatus(String status);
}
