package com.localfix.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "replaced_parts")
public class ReplacedPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_proof_id", nullable = false)
    @JsonIgnore
    private WorkProof workProof;

    @Column(nullable = false)
    private String partName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal partPrice;

    @Column(columnDefinition = "TEXT")
    private String oldPartImageUrl;

    @Column(columnDefinition = "TEXT")
    private String newPartImageUrl;

    private Integer warrantyMonths = 0;

    public ReplacedPart() {}

    public ReplacedPart(Long id, WorkProof workProof, String partName, BigDecimal partPrice, String oldPartImageUrl, String newPartImageUrl, Integer warrantyMonths) {
        this.id = id;
        this.workProof = workProof;
        this.partName = partName;
        this.partPrice = partPrice;
        this.oldPartImageUrl = oldPartImageUrl;
        this.newPartImageUrl = newPartImageUrl;
        this.warrantyMonths = warrantyMonths != null ? warrantyMonths : 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WorkProof getWorkProof() { return workProof; }
    public void setWorkProof(WorkProof workProof) { this.workProof = workProof; }

    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }

    public BigDecimal getPartPrice() { return partPrice; }
    public void setPartPrice(BigDecimal partPrice) { this.partPrice = partPrice; }

    public String getOldPartImageUrl() { return oldPartImageUrl; }
    public void setOldPartImageUrl(String oldPartImageUrl) { this.oldPartImageUrl = oldPartImageUrl; }

    public String getNewPartImageUrl() { return newPartImageUrl; }
    public void setNewPartImageUrl(String newPartImageUrl) { this.newPartImageUrl = newPartImageUrl; }

    public Integer getWarrantyMonths() { return warrantyMonths; }
    public void setWarrantyMonths(Integer warrantyMonths) { this.warrantyMonths = warrantyMonths; }
}
