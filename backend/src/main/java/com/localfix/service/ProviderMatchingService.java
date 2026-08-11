package com.localfix.service;

import com.localfix.model.VendorProfile;
import com.localfix.repository.VendorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProviderMatchingService {

    @Autowired
    private VendorProfileRepository vendorRepository;

    public List<Map<String, Object>> findAndRankMatches(String categoryName, String city, boolean emergency) {
        List<VendorProfile> approvedVendors = vendorRepository.findAll().stream()
                .filter(VendorProfile::isApproved)
                .collect(Collectors.toList());

        List<Map<String, Object>> rankedMatches = new ArrayList<>();

        for (VendorProfile vendor : approvedVendors) {
            double score = 50.0; // Base score
            List<String> recommendationReasons = new ArrayList<>();

            // 1. City Match
            if (city != null && vendor.getCity() != null && city.equalsIgnoreCase(vendor.getCity())) {
                score += 30.0;
                recommendationReasons.add("Based in " + vendor.getCity());
            } else {
                recommendationReasons.add("Covers " + (vendor.getCity() != null ? vendor.getCity() : "local area"));
            }

            // 2. Rating Boost
            if (vendor.getRating() != null) {
                score += vendor.getRating() * 5.0;
                recommendationReasons.add(vendor.getRating() + "★ Rating");
            }

            // 3. Category match tag
            if (categoryName != null) {
                recommendationReasons.add(categoryName + " Specialist");
            }

            // Emergency Priority
            if (emergency) {
                score += 15.0;
                recommendationReasons.add("Available for Emergency Dispatch");
            }

            Map<String, Object> matchObj = new HashMap<>();
            matchObj.put("vendorId", vendor.getId());
            matchObj.put("businessName", vendor.getBusinessName());
            matchObj.put("ownerName", vendor.getUser() != null ? vendor.getUser().getName() : "Verified Specialist");
            matchObj.put("phone", vendor.getUser() != null ? vendor.getUser().getPhone() : null);
            matchObj.put("city", vendor.getCity());
            matchObj.put("rating", vendor.getRating() != null ? vendor.getRating() : 5.0);
            matchObj.put("totalReviews", vendor.getTotalReviews() != null ? vendor.getTotalReviews() : 1);
            matchObj.put("matchScore", Math.round(score));
            matchObj.put("recommendationReason", String.join(" • ", recommendationReasons));

            rankedMatches.add(matchObj);
        }

        // Sort by match score descending
        rankedMatches.sort((a, b) -> Double.compare((Double) b.get("matchScore"), (Double) a.get("matchScore")));

        return rankedMatches;
    }
}
