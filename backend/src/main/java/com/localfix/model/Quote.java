package com.localfix.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "quotes")
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal quotedPrice;

    private String warrantyPeriod;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Quote() {}

    public Quote(Long id, User customer, VendorProfile vendor, ServiceCategory category, String title, String description, BigDecimal quotedPrice, String warrantyPeriod, String status, LocalDateTime createdAt) {
        this.id = id;
        this.customer = customer;
        this.vendor = vendor;
        this.category = category;
        this.title = title;
        this.description = description;
        this.quotedPrice = quotedPrice;
        this.warrantyPeriod = warrantyPeriod;
        this.status = status != null ? status : "PENDING";
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public VendorProfile getVendor() { return vendor; }
    public void setVendor(VendorProfile vendor) { this.vendor = vendor; }

    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getQuotedPrice() { return quotedPrice; }
    public void setQuotedPrice(BigDecimal quotedPrice) { this.quotedPrice = quotedPrice; }

    public String getWarrantyPeriod() { return warrantyPeriod; }
    public void setWarrantyPeriod(String warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User customer;
        private VendorProfile vendor;
        private ServiceCategory category;
        private String title;
        private String description;
        private BigDecimal quotedPrice;
        private String warrantyPeriod;
        private String status = "PENDING";
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder customer(User customer) { this.customer = customer; return this; }
        public Builder vendor(VendorProfile vendor) { this.vendor = vendor; return this; }
        public Builder category(ServiceCategory category) { this.category = category; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder quotedPrice(BigDecimal quotedPrice) { this.quotedPrice = quotedPrice; return this; }
        public Builder warrantyPeriod(String warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Quote build() {
            return new Quote(id, customer, vendor, category, title, description, quotedPrice, warrantyPeriod, status, createdAt);
        }
    }
}
