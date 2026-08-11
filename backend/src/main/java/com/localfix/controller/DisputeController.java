package com.localfix.controller;

import com.localfix.model.Dispute;
import com.localfix.security.UserPrincipal;
import com.localfix.service.DisputeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DisputeController {

    @Autowired
    private DisputeService disputeService;

    @PostMapping("/disputes")
    public ResponseEntity<Dispute> raiseDispute(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, Object> payload
    ) {
        Long bookingId = Long.parseLong(payload.get("bookingId").toString());
        String reason = (String) payload.get("reason");
        String description = (String) payload.get("description");
        String evidenceUrl = (String) payload.get("evidenceUrl");

        return ResponseEntity.ok(disputeService.raiseDispute(bookingId, currentUser.getId(), reason, description, evidenceUrl));
    }

    @GetMapping("/user/disputes")
    public ResponseEntity<List<Dispute>> getUserDisputes(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(disputeService.getUserDisputes(currentUser.getId()));
    }

    @GetMapping("/admin/disputes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        return ResponseEntity.ok(disputeService.getAllDisputes());
    }

    @PatchMapping("/admin/disputes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Dispute> updateDispute(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.get("status");
        String adminNotes = payload.get("adminNotes");
        return ResponseEntity.ok(disputeService.updateDisputeStatus(id, status, adminNotes));
    }
}
