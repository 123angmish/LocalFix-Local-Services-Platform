package com.localfix.service;

import com.localfix.model.ServicePricing;
import com.localfix.repository.ServicePricingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PricingIntelligenceService {

    @Autowired
    private ServicePricingRepository pricingRepository;

    public Map<String, Object> evaluateQuotePrice(Long categoryId, String jobType, BigDecimal quotedAmount) {
        Map<String, Object> result = new HashMap<>();

        Optional<ServicePricing> pricingOpt = pricingRepository.findByCategoryIdAndJobTypeContainingIgnoreCase(categoryId, jobType);

        if (pricingOpt.isPresent()) {
            ServicePricing pricing = pricingOpt.get();
            BigDecimal min = pricing.getMinTypicalPrice();
            BigDecimal max = pricing.getMaxTypicalPrice();

            result.put("typicalMin", min);
            result.put("typicalMax", max);
            result.put("typicalRangeFormatted", "₹" + min + " - ₹" + max);
            result.put("explanation", "Typical LocalFix range for " + pricing.getJobType() + " is ₹" + min + "–₹" + max + ". Actual cost may vary depending on parts and physical inspection.");

            if (quotedAmount.compareTo(max.multiply(new BigDecimal("1.30"))) > 0) {
                result.put("rating", "Significantly Above Typical");
                result.put("colorClass", "text-rose-600 bg-rose-50 border-rose-200");
            } else if (quotedAmount.compareTo(max) > 0) {
                result.put("rating", "Slightly Above Typical");
                result.put("colorClass", "text-amber-600 bg-amber-50 border-amber-200");
            } else {
                result.put("rating", "Fair Price");
                result.put("colorClass", "text-emerald-600 bg-emerald-50 border-emerald-200");
            }
        } else {
            // General market fallback assessment
            result.put("typicalMin", new BigDecimal("299.00"));
            result.put("typicalMax", new BigDecimal("799.00"));
            result.put("typicalRangeFormatted", "₹299 - ₹799");
            result.put("explanation", "Standard LocalFix market range is ₹299–₹799 for standard labor. Final price depends on parts replacement.");
            result.put("rating", "Fair Price");
            result.put("colorClass", "text-emerald-600 bg-emerald-50 border-emerald-200");
        }

        return result;
    }
}
