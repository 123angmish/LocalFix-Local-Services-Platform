package com.localfix.service;

import com.localfix.model.Booking;
import com.localfix.model.Dispute;
import com.localfix.model.User;
import com.localfix.repository.BookingRepository;
import com.localfix.repository.DisputeRepository;
import com.localfix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public Dispute raiseDispute(Long bookingId, Long raisedById, String reason, String description, String evidenceUrl) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User user = userRepository.findById(raisedById)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dispute dispute = new Dispute(null, booking, user, reason, description, evidenceUrl, "OPEN", null);
        return disputeRepository.save(dispute);
    }

    public List<Dispute> getUserDisputes(Long userId) {
        return disputeRepository.findByRaisedByIdOrderByCreatedAtDesc(userId);
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    public Dispute updateDisputeStatus(Long disputeId, String status, String adminNotes) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        dispute.setStatus(status);
        if (adminNotes != null) dispute.setAdminNotes(adminNotes);

        return disputeRepository.save(dispute);
    }
}
