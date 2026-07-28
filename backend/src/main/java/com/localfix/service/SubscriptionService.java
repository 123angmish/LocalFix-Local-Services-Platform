package com.localfix.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SubscriptionService {

    public List<Map<String, Object>> getPlans() {
        List<Map<String, Object>> plans = new ArrayList<>();

        Map<String, Object> basic = new HashMap<>();
        basic.put("id", 1);
        basic.put("name", "FixPass Basic");
        basic.put("price", 299);
        basic.put("period", "Monthly");
        basic.put("features", Arrays.asList(
                "Free visiting charges on all services",
                "10% extra discount on labor fees",
                "2 Free comprehensive home inspections per year",
                "Priority technician matching"
        ));
        plans.add(basic);

        Map<String, Object> family = new HashMap<>();
        family.put("id", 2);
        family.put("name", "FixPass Family");
        family.put("price", 699);
        family.put("period", "Monthly");
        family.put("popular", true);
        family.put("features", Arrays.asList(
                "Everything in Basic Plan",
                "Coverage for up to 3 saved properties",
                "Zero emergency surge fees",
                "Annual free AC & Appliance tune-up",
                "Dedicated 24/7 VIP helpline"
        ));
        plans.add(family);

        Map<String, Object> rental = new HashMap<>();
        rental.put("id", 3);
        rental.put("name", "FixPass Rental");
        rental.put("price", 1499);
        rental.put("period", "Monthly");
        rental.put("features", Arrays.asList(
                "Multi-property landlord maintenance dashboard",
                "Tenant request direct approval workflow",
                "Consolidated monthly tax invoices",
                "Automated preventive care reminders"
        ));
        plans.add(rental);

        return plans;
    }

    public Map<String, Object> subscribe(Long userId, Long planId) {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("userId", userId);
        res.put("planId", planId);
        res.put("activeUntil", java.time.LocalDate.now().plusDays(30).toString());
        res.put("message", "FixPass subscription activated successfully!");
        return res;
    }
}
