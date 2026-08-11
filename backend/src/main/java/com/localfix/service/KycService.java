package com.localfix.service;

import com.localfix.model.KycDocument;
import com.localfix.model.VendorProfile;
import com.localfix.repository.KycDocumentRepository;
import com.localfix.repository.VendorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KycService {

    @Autowired
    private KycDocumentRepository kycRepository;

    @Autowired
    private VendorProfileRepository vendorRepository;

    public KycDocument submitKycDocument(Long vendorId, String documentType, String documentNumber, String documentUrl) {
        VendorProfile vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));

        KycDocument doc = new KycDocument(null, vendor, documentType, documentNumber, documentUrl, "PENDING", null);
        return kycRepository.save(doc);
    }

    public List<KycDocument> getVendorKycDocuments(Long vendorId) {
        return kycRepository.findByVendorId(vendorId);
    }

    public List<KycDocument> getPendingKycDocuments() {
        return kycRepository.findByStatus("PENDING");
    }

    public KycDocument verifyDocument(Long docId, boolean approve, String rejectionReason) {
        KycDocument doc = kycRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("KYC document not found"));

        doc.setStatus(approve ? "VERIFIED" : "REJECTED");
        if (!approve && rejectionReason != null) {
            doc.setRejectionReason(rejectionReason);
        }

        KycDocument saved = kycRepository.save(doc);

        // Check if all documents for vendor are verified to mark vendor approved
        if (approve) {
            List<KycDocument> vendorDocs = kycRepository.findByVendorId(doc.getVendor().getId());
            boolean allVerified = vendorDocs.stream().allMatch(d -> "VERIFIED".equalsIgnoreCase(d.getStatus()));
            if (allVerified && !vendorDocs.isEmpty()) {
                VendorProfile vendor = doc.getVendor();
                vendor.setApproved(true);
                vendorRepository.save(vendor);
            }
        }

        return saved;
    }
}
