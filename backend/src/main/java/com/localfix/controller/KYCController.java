package com.localfix.controller;

import com.localfix.model.KycDocument;
import com.localfix.model.User;
import com.localfix.model.VendorProfile;
import com.localfix.repository.UserRepository;
import com.localfix.repository.VendorProfileRepository;
import com.localfix.security.UserPrincipal;
import com.localfix.service.KycService;
import com.localfix.service.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class KYCController {

    @Autowired
    private KycService kycService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private VendorProfileRepository vendorRepository;

    @PostMapping("/vendor/kyc/upload")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<KycDocument> uploadKycDocument(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "documentNumber", required = false) String documentNumber,
            @RequestParam("file") MultipartFile file
    ) {
        VendorProfile vendor = vendorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));

        String fileUrl = storageService.storeFile(file, "kyc");
        KycDocument doc = kycService.submitKycDocument(vendor.getId(), documentType, documentNumber, fileUrl);
        return ResponseEntity.ok(doc);
    }

    @GetMapping("/vendor/kyc")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<KycDocument>> getVendorKycDocuments(@AuthenticationPrincipal UserPrincipal currentUser) {
        VendorProfile vendor = vendorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));

        return ResponseEntity.ok(kycService.getVendorKycDocuments(vendor.getId()));
    }

    @GetMapping("/admin/kyc/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<KycDocument>> getPendingKycDocuments() {
        return ResponseEntity.ok(kycService.getPendingKycDocuments());
    }

    @PatchMapping("/admin/kyc/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KycDocument> verifyDocument(
            @PathVariable Long id,
            @RequestParam("approve") boolean approve,
            @RequestParam(value = "rejectionReason", required = false) String rejectionReason
    ) {
        return ResponseEntity.ok(kycService.verifyDocument(id, approve, rejectionReason));
    }
}
