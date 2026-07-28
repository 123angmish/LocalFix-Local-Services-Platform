package com.localfix.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

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
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceItem service;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private String timeSlot;

    @Column(nullable = false)
    private String address;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(length = 10)
    private String verificationCode;

    private BigDecimal discountAmount = BigDecimal.ZERO;

    private String promoCode;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Booking() {}

    public Booking(Long id, User customer, VendorProfile vendor, ServiceItem service, LocalDate bookingDate, String timeSlot, String address, String notes, BookingStatus status, BigDecimal totalAmount, String verificationCode, BigDecimal discountAmount, String promoCode, LocalDateTime startedAt, LocalDateTime completedAt, LocalDateTime createdAt) {
        this.id = id;
        this.customer = customer;
        this.vendor = vendor;
        this.service = service;
        this.bookingDate = bookingDate;
        this.timeSlot = timeSlot;
        this.address = address;
        this.notes = notes;
        this.status = status != null ? status : BookingStatus.PENDING;
        this.totalAmount = totalAmount;
        this.verificationCode = verificationCode;
        this.discountAmount = discountAmount != null ? discountAmount : BigDecimal.ZERO;
        this.promoCode = promoCode;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.verificationCode == null) {
            this.verificationCode = String.format("%04d", (int)(Math.random() * 9000) + 1000);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public VendorProfile getVendor() { return vendor; }
    public void setVendor(VendorProfile vendor) { this.vendor = vendor; }

    public ServiceItem getService() { return service; }
    public void setService(ServiceItem service) { this.service = service; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User customer;
        private VendorProfile vendor;
        private ServiceItem service;
        private LocalDate bookingDate;
        private String timeSlot;
        private String address;
        private String notes;
        private BookingStatus status = BookingStatus.PENDING;
        private BigDecimal totalAmount;
        private String verificationCode;
        private BigDecimal discountAmount = BigDecimal.ZERO;
        private String promoCode;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder customer(User customer) { this.customer = customer; return this; }
        public Builder vendor(VendorProfile vendor) { this.vendor = vendor; return this; }
        public Builder service(ServiceItem service) { this.service = service; return this; }
        public Builder bookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; return this; }
        public Builder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder status(BookingStatus status) { this.status = status; return this; }
        public Builder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder verificationCode(String verificationCode) { this.verificationCode = verificationCode; return this; }
        public Builder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public Builder promoCode(String promoCode) { this.promoCode = promoCode; return this; }
        public Builder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public Builder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Booking build() {
            return new Booking(id, customer, vendor, service, bookingDate, timeSlot, address, notes, status, totalAmount, verificationCode, discountAmount, promoCode, startedAt, completedAt, createdAt);
        }
    }
}
