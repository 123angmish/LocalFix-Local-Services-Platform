package com.localfix.controller;

import com.localfix.model.Quote;
import com.localfix.security.UserPrincipal;
import com.localfix.service.QuoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/quotes")
@Tag(name = "Reverse Bidding Quotes", description = "Endpoints for reverse quote marketplace")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Submit professional quote (Vendor)")
    public ResponseEntity<Quote> createQuote(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam Long customerId,
            @RequestParam Long categoryId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String warranty) {
        return ResponseEntity.ok(quoteService.createQuote(principal.getId(), customerId, categoryId, title, description, price, warranty));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get received quotes (Customer)")
    public ResponseEntity<List<Quote>> getCustomerQuotes(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(quoteService.getCustomerQuotes(principal.getId()));
    }

    @GetMapping("/vendor")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Get submitted quotes (Vendor)")
    public ResponseEntity<List<Quote>> getVendorQuotes(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(quoteService.getVendorQuotes(principal.getId()));
    }

    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Accept professional quote")
    public ResponseEntity<Quote> acceptQuote(@PathVariable Long id) {
        return ResponseEntity.ok(quoteService.updateQuoteStatus(id, "ACCEPTED"));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Reject professional quote")
    public ResponseEntity<Quote> rejectQuote(@PathVariable Long id) {
        return ResponseEntity.ok(quoteService.updateQuoteStatus(id, "REJECTED"));
    }
}
