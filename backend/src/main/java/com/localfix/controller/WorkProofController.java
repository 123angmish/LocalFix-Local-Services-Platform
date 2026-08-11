package com.localfix.controller;

import com.localfix.model.WorkProof;
import com.localfix.service.WorkProofService;
import com.localfix.service.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class WorkProofController {

    @Autowired
    private WorkProofService workProofService;

    @Autowired
    private StorageService storageService;

    @PostMapping("/vendor/bookings/{bookingId}/work-proof")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<WorkProof> submitWorkProof(
            @PathVariable Long bookingId,
            @RequestParam(value = "beforeImage", required = false) MultipartFile beforeImage,
            @RequestParam(value = "afterImage", required = false) MultipartFile afterImage,
            @RequestParam("workPerformedNotes") String notes,
            @RequestParam(value = "labourCharge", defaultValue = "0") BigDecimal labourCharge,
            @RequestParam(value = "partsCharge", defaultValue = "0") BigDecimal partsCharge
    ) {
        String beforeUrl = beforeImage != null && !beforeImage.isEmpty() ? storageService.storeFile(beforeImage, "workproof") : null;
        String afterUrl = afterImage != null && !afterImage.isEmpty() ? storageService.storeFile(afterImage, "workproof") : null;

        WorkProof wp = workProofService.submitWorkProof(bookingId, beforeUrl, afterUrl, notes, labourCharge, partsCharge, null);
        return ResponseEntity.ok(wp);
    }

    @GetMapping("/bookings/{bookingId}/work-proof")
    public ResponseEntity<WorkProof> getWorkProof(@PathVariable Long bookingId) {
        Optional<WorkProof> wp = workProofService.getWorkProofByBooking(bookingId);
        return wp.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
