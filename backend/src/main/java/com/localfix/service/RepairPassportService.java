package com.localfix.service;

import com.localfix.model.Appliance;
import com.localfix.model.Booking;
import com.localfix.model.RepairPassport;
import com.localfix.model.User;
import com.localfix.repository.ApplianceRepository;
import com.localfix.repository.BookingRepository;
import com.localfix.repository.RepairPassportRepository;
import com.localfix.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class RepairPassportService {

    @Autowired
    private ApplianceRepository applianceRepository;

    @Autowired
    private RepairPassportRepository repairPassportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Appliance registerAppliance(Long customerId, String name, String brand, String model, Integer purchaseYear, String serialNumber) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Appliance appliance = new Appliance(null, customer, name, brand, model, null, purchaseYear, serialNumber);
        return applianceRepository.save(appliance);
    }

    public List<Appliance> getCustomerAppliances(Long customerId) {
        return applianceRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public RepairPassport addPassportEntry(Long applianceId, Long bookingId, String diagnosisSummary, String workSummary, BigDecimal totalSpent, Integer partsCount) {
        Appliance appliance = applianceRepository.findById(applianceId)
                .orElseThrow(() -> new RuntimeException("Appliance asset not found"));

        Booking booking = null;
        if (bookingId != null) {
            booking = bookingRepository.findById(bookingId).orElse(null);
        }

        RepairPassport passport = new RepairPassport(null, appliance, booking, diagnosisSummary, workSummary, totalSpent, partsCount);
        return repairPassportRepository.save(passport);
    }

    public List<RepairPassport> getApplianceHistory(Long applianceId) {
        return repairPassportRepository.findByApplianceIdOrderByCreatedAtDesc(applianceId);
    }

    public Map<String, Object> getCustomerRepairPassportSummary(Long customerId) {
        List<Appliance> appliances = getCustomerAppliances(customerId);
        List<RepairPassport> passports = repairPassportRepository.findByApplianceCustomerIdOrderByCreatedAtDesc(customerId);

        BigDecimal totalMaintenanceSpent = passports.stream()
                .map(RepairPassport::getTotalSpent)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalPartsReplaced = passports.stream()
                .mapToInt(p -> p.getPartsReplacedCount() != null ? p.getPartsReplacedCount() : 0)
                .sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAppliances", appliances.size());
        summary.put("totalRepairsCount", passports.size());
        summary.put("totalMaintenanceSpent", totalMaintenanceSpent);
        summary.put("totalPartsReplaced", totalPartsReplaced);
        summary.put("appliances", appliances);
        summary.put("recentTimeline", passports);

        return summary;
    }
}
