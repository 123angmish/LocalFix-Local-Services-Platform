package com.localfix.service;

import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.Property;
import com.localfix.model.User;
import com.localfix.repository.PropertyRepository;
import com.localfix.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyService(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Property createProperty(Long customerId, String title, String address, String city, String propertyType) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        Property property = Property.builder()
                .customer(customer)
                .title(title)
                .address(address)
                .city(city != null ? city : "Mumbai")
                .propertyType(propertyType != null ? propertyType : "APARTMENT")
                .build();

        return propertyRepository.save(property);
    }

    public List<Property> getCustomerProperties(Long customerId) {
        return propertyRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public Map<String, Object> getPropertyPassport(Long propertyId) {
        Map<String, Object> passport = new HashMap<>();
        passport.put("propertyId", propertyId);
        passport.put("healthScore", "94/100 (Excellent Condition)");

        List<Map<String, String>> history = new ArrayList<>();
        Map<String, String> item1 = new HashMap<>();
        item1.put("date", "2026-06-15");
        item1.put("type", "Plumbing Leak Fix");
        item1.put("technician", "Metro Flow Plumbing");
        item1.put("warranty", "Active (Valid till 2026-12-15)");
        item1.put("status", "COMPLETED");
        history.add(item1);

        Map<String, String> item2 = new HashMap<>();
        item2.put("date", "2026-04-10");
        item2.put("type", "Split AC Deep Cleaning");
        item2.put("technician", "VoltCraft Electricals");
        item2.put("warranty", "Completed");
        item2.put("status", "COMPLETED");
        history.add(item2);

        passport.put("maintenanceHistory", history);
        passport.put("upcomingTasks", Arrays.asList(
                "Annual Water Tank Sanitization (Due in 45 days)",
                "Pre-Monsoon Roof Leakage Inspection (Recommended)"
        ));

        return passport;
    }
}
