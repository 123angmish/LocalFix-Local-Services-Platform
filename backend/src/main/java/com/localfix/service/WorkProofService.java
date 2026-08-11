package com.localfix.service;

import com.localfix.model.Booking;
import com.localfix.model.ReplacedPart;
import com.localfix.model.WorkProof;
import com.localfix.repository.BookingRepository;
import com.localfix.repository.ReplacedPartRepository;
import com.localfix.repository.WorkProofRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class WorkProofService {

    @Autowired
    private WorkProofRepository workProofRepository;

    @Autowired
    private ReplacedPartRepository replacedPartRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public WorkProof submitWorkProof(Long bookingId, String beforeImageUrl, String afterImageUrl, String notes, BigDecimal labourCharge, BigDecimal partsCharge, List<ReplacedPart> parts) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Optional<WorkProof> existingOpt = workProofRepository.findByBookingId(bookingId);
        WorkProof workProof = existingOpt.orElseGet(() -> new WorkProof(null, booking, beforeImageUrl, afterImageUrl, notes, labourCharge, partsCharge));

        workProof.setBeforeImageUrl(beforeImageUrl);
        workProof.setAfterImageUrl(afterImageUrl);
        workProof.setWorkPerformedNotes(notes);
        if (labourCharge != null) workProof.setLabourCharge(labourCharge);
        if (partsCharge != null) workProof.setPartsCharge(partsCharge);

        WorkProof saved = workProofRepository.save(workProof);

        if (parts != null && !parts.isEmpty()) {
            for (ReplacedPart p : parts) {
                p.setWorkProof(saved);
                replacedPartRepository.save(p);
            }
        }

        return saved;
    }

    public Optional<WorkProof> getWorkProofByBooking(Long bookingId) {
        return workProofRepository.findByBookingId(bookingId);
    }
}
