package com.localfix.repository;

import com.localfix.model.RepairPassport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairPassportRepository extends JpaRepository<RepairPassport, Long> {
    List<RepairPassport> findByApplianceIdOrderByCreatedAtDesc(Long applianceId);
    List<RepairPassport> findByApplianceCustomerIdOrderByCreatedAtDesc(Long customerId);
}
