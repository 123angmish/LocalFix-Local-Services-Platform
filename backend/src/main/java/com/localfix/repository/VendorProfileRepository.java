package com.localfix.repository;

import com.localfix.model.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {
    Optional<VendorProfile> findByUserId(Long userId);
    List<VendorProfile> findByApproved(boolean approved);
    List<VendorProfile> findByCity(String city);
}
