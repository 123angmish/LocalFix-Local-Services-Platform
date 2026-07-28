package com.localfix.repository;

import com.localfix.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceItem, Long>, JpaSpecificationExecutor<ServiceItem> {
    List<ServiceItem> findByVendorId(Long vendorId);
    List<ServiceItem> findByCategoryId(Long categoryId);
    List<ServiceItem> findByActive(boolean active);

    @Modifying
    @Transactional
    @Query("DELETE FROM ServiceItem s WHERE s.vendor.id = :vendorId")
    void deleteByVendorId(@Param("vendorId") Long vendorId);
}
