package com.localfix.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_pricings")
public class ServicePricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @Column(nullable = false)
    private String jobType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal minTypicalPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal maxTypicalPrice;

    @Column(nullable = false)
    private String unit = "JOB";

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ServicePricing() {}

    public ServicePricing(Long id, ServiceCategory category, String jobType, BigDecimal minTypicalPrice, BigDecimal maxTypicalPrice, String unit) {
        this.id = id;
        this.category = category;
        this.jobType = jobType;
        this.minTypicalPrice = minTypicalPrice;
        this.maxTypicalPrice = maxTypicalPrice;
        this.unit = unit != null ? unit : "JOB";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }

    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }

    public BigDecimal getMinTypicalPrice() { return minTypicalPrice; }
    public void setMinTypicalPrice(BigDecimal minTypicalPrice) { this.minTypicalPrice = minTypicalPrice; }

    public BigDecimal getMaxTypicalPrice() { return maxTypicalPrice; }
    public void setMaxTypicalPrice(BigDecimal maxTypicalPrice) { this.maxTypicalPrice = maxTypicalPrice; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
