package com.localfix.controller;

import com.localfix.service.PricingIntelligenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/pricing")
public class PricingIntelligenceController {

    @Autowired
    private PricingIntelligenceService pricingService;

    @GetMapping("/evaluate")
    public ResponseEntity<Map<String, Object>> evaluatePrice(
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "jobType", defaultValue = "general") String jobType,
            @RequestParam("amount") BigDecimal amount
    ) {
        return ResponseEntity.ok(pricingService.evaluateQuotePrice(categoryId, jobType, amount));
    }
}
