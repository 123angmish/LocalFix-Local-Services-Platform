package com.localfix.service;

import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.*;
import com.localfix.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final ServiceCategoryRepository categoryRepository;

    public QuoteService(QuoteRepository quoteRepository, UserRepository userRepository, VendorProfileRepository vendorProfileRepository, ServiceCategoryRepository categoryRepository) {
        this.quoteRepository = quoteRepository;
        this.userRepository = userRepository;
        this.vendorProfileRepository = vendorProfileRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Quote createQuote(Long vendorUserId, Long customerId, Long categoryId, String title, String description, BigDecimal price, String warranty) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        VendorProfile vendor = vendorProfileRepository.findByUserId(vendorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found for user: " + vendorUserId));

        ServiceCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        Quote quote = Quote.builder()
                .customer(customer)
                .vendor(vendor)
                .category(category)
                .title(title)
                .description(description)
                .quotedPrice(price)
                .warrantyPeriod(warranty != null ? warranty : "30 Days Warranty")
                .status("PENDING")
                .build();

        return quoteRepository.save(quote);
    }

    public List<Quote> getCustomerQuotes(Long customerId) {
        return quoteRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Quote> getVendorQuotes(Long vendorUserId) {
        VendorProfile vendor = vendorProfileRepository.findByUserId(vendorUserId).orElse(null);
        if (vendor == null) return List.of();
        return quoteRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());
    }

    @Transactional
    public Quote updateQuoteStatus(Long quoteId, String status) {
        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() -> new ResourceNotFoundException("Quote not found with id: " + quoteId));

        quote.setStatus(status.toUpperCase());
        return quoteRepository.save(quote);
    }
}
