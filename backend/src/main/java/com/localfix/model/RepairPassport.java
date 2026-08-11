package com.localfix.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair_passports")
public class RepairPassport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appliance_id", nullable = false)
    private Appliance appliance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(columnDefinition = "TEXT")
    private String diagnosisSummary;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String workSummary;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalSpent = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer partsReplacedCount = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RepairPassport() {}

    public RepairPassport(Long id, Appliance appliance, Booking booking, String diagnosisSummary, String workSummary, BigDecimal totalSpent, Integer partsReplacedCount) {
        this.id = id;
        this.appliance = appliance;
        this.booking = booking;
        this.diagnosisSummary = diagnosisSummary;
        this.workSummary = workSummary;
        this.totalSpent = totalSpent != null ? totalSpent : BigDecimal.ZERO;
        this.partsReplacedCount = partsReplacedCount != null ? partsReplacedCount : 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Appliance getAppliance() { return appliance; }
    public void setAppliance(Appliance appliance) { this.appliance = appliance; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getDiagnosisSummary() { return diagnosisSummary; }
    public void setDiagnosisSummary(String diagnosisSummary) { this.diagnosisSummary = diagnosisSummary; }

    public String getWorkSummary() { return workSummary; }
    public void setWorkSummary(String workSummary) { this.workSummary = workSummary; }

    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }

    public Integer getPartsReplacedCount() { return partsReplacedCount; }
    public void setPartsReplacedCount(Integer partsReplacedCount) { this.partsReplacedCount = partsReplacedCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
