package com.localfix.repository;

import com.localfix.model.WorkProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkProofRepository extends JpaRepository<WorkProof, Long> {
    Optional<WorkProof> findByBookingId(Long bookingId);
}
