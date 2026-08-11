package com.localfix.repository;

import com.localfix.model.KycDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KycDocumentRepository extends JpaRepository<KycDocument, Long> {
    List<KycDocument> findByVendorId(Long vendorId);
    List<KycDocument> findByStatus(String status);
}
