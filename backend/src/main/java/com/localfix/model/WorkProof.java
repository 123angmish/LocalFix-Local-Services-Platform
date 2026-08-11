package com.localfix.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "work_proofs")
public class WorkProof {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(columnDefinition = "TEXT")
    private String beforeImageUrl;

    @Column(columnDefinition = "TEXT")
    private String afterImageUrl;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String workPerformedNotes;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal labourCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal partsCharge = BigDecimal.ZERO;

    @OneToMany(mappedBy = "workProof", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReplacedPart> replacedParts = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public WorkProof() {}

    public WorkProof(Long id, Booking booking, String beforeImageUrl, String afterImageUrl, String workPerformedNotes, BigDecimal labourCharge, BigDecimal partsCharge) {
        this.id = id;
        this.booking = booking;
        this.beforeImageUrl = beforeImageUrl;
        this.afterImageUrl = afterImageUrl;
        this.workPerformedNotes = workPerformedNotes;
        this.labourCharge = labourCharge != null ? labourCharge : BigDecimal.ZERO;
        this.partsCharge = partsCharge != null ? partsCharge : BigDecimal.ZERO;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getBeforeImageUrl() { return beforeImageUrl; }
    public void setBeforeImageUrl(String beforeImageUrl) { this.beforeImageUrl = beforeImageUrl; }

    public String getAfterImageUrl() { return afterImageUrl; }
    public void setAfterImageUrl(String afterImageUrl) { this.afterImageUrl = afterImageUrl; }

    public String getWorkPerformedNotes() { return workPerformedNotes; }
    public void setWorkPerformedNotes(String workPerformedNotes) { this.workPerformedNotes = workPerformedNotes; }

    public BigDecimal getLabourCharge() { return labourCharge; }
    public void setLabourCharge(BigDecimal labourCharge) { this.labourCharge = labourCharge; }

    public BigDecimal getPartsCharge() { return partsCharge; }
    public void setPartsCharge(BigDecimal partsCharge) { this.partsCharge = partsCharge; }

    public List<ReplacedPart> getReplacedParts() { return replacedParts; }
    public void setReplacedParts(List<ReplacedPart> replacedParts) { this.replacedParts = replacedParts; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
