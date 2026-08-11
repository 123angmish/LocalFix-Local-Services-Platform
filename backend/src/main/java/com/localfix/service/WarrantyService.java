package com.localfix.service;

import com.localfix.model.Booking;
import com.localfix.model.Warranty;
import com.localfix.model.WarrantyClaim;
import com.localfix.repository.BookingRepository;
import com.localfix.repository.WarrantyClaimRepository;
import com.localfix.repository.WarrantyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class WarrantyService {

    @Autowired
    private WarrantyRepository warrantyRepository;

    @Autowired
    private WarrantyClaimRepository claimRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Warranty issueBookingWarranty(Long bookingId, int warrantyDays) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Optional<Warranty> existing = warrantyRepository.findByBookingId(bookingId);
        if (existing.isPresent()) return existing.get();

        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(warrantyDays > 0 ? warrantyDays : 30);

        Warranty warranty = new Warranty(
                null,
                booking,
                booking.getCustomer(),
                booking.getVendor(),
                booking.getService() != null ? booking.getService().getTitle() : "Service Warranty",
                start,
                end,
                "ACTIVE"
        );

        return warrantyRepository.save(warranty);
    }

    public List<Warranty> getCustomerWarranties(Long customerId) {
        List<Warranty> list = warrantyRepository.findByCustomerIdOrderByEndDateAsc(customerId);
        LocalDate today = LocalDate.now();

        // Update status on fetch if expired or expiring soon
        for (Warranty w : list) {
            if (w.getEndDate().isBefore(today) && !"CLAIMED".equalsIgnoreCase(w.getStatus())) {
                w.setStatus("EXPIRED");
            } else if (w.getEndDate().isBefore(today.plusDays(7)) && "ACTIVE".equalsIgnoreCase(w.getStatus())) {
                w.setStatus("EXPIRING_SOON");
            }
        }
        return list;
    }

    public WarrantyClaim raiseWarrantyClaim(Long warrantyId, Long customerId, String issueDescription) {
        Warranty warranty = warrantyRepository.findById(warrantyId)
                .orElseThrow(() -> new RuntimeException("Warranty not found"));

        WarrantyClaim claim = new WarrantyClaim(null, warranty, warranty.getCustomer(), issueDescription, "OPEN", null);
        warranty.setStatus("CLAIMED");
        warrantyRepository.save(warranty);

        return claimRepository.save(claim);
    }

    public List<WarrantyClaim> getCustomerWarrantyClaims(Long customerId) {
        return claimRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}
