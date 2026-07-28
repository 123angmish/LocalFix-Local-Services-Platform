package com.localfix.dto.booking;

import com.localfix.model.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDto {
    private Long id;

    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private Long vendorId;
    private String vendorBusinessName;
    private String vendorPhone;

    private Long serviceId;
    private String serviceTitle;
    private String categoryName;

    private LocalDate bookingDate;
    private String timeSlot;
    private String address;
    private String notes;
    private BookingStatus status;
    private BigDecimal totalAmount;

    private String paymentMethod;
    private String paymentStatus;
    private Boolean reviewed;

    private String verificationCode;
    private BigDecimal discountAmount;
    private String promoCode;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    public BookingDto() {}

    public BookingDto(Long id, Long customerId, String customerName, String customerEmail, String customerPhone, Long vendorId, String vendorBusinessName, String vendorPhone, Long serviceId, String serviceTitle, String categoryName, LocalDate bookingDate, String timeSlot, String address, String notes, BookingStatus status, BigDecimal totalAmount, String paymentMethod, String paymentStatus, Boolean reviewed, String verificationCode, BigDecimal discountAmount, String promoCode, LocalDateTime startedAt, LocalDateTime completedAt, LocalDateTime createdAt) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.vendorId = vendorId;
        this.vendorBusinessName = vendorBusinessName;
        this.vendorPhone = vendorPhone;
        this.serviceId = serviceId;
        this.serviceTitle = serviceTitle;
        this.categoryName = categoryName;
        this.bookingDate = bookingDate;
        this.timeSlot = timeSlot;
        this.address = address;
        this.notes = notes;
        this.status = status;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.reviewed = reviewed;
        this.verificationCode = verificationCode;
        this.discountAmount = discountAmount;
        this.promoCode = promoCode;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }

    public String getVendorBusinessName() { return vendorBusinessName; }
    public void setVendorBusinessName(String vendorBusinessName) { this.vendorBusinessName = vendorBusinessName; }

    public String getVendorPhone() { return vendorPhone; }
    public void setVendorPhone(String vendorPhone) { this.vendorPhone = vendorPhone; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public String getServiceTitle() { return serviceTitle; }
    public void setServiceTitle(String serviceTitle) { this.serviceTitle = serviceTitle; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

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

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Boolean getReviewed() { return reviewed; }
    public void setReviewed(Boolean reviewed) { this.reviewed = reviewed; }

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
        private Long customerId;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private Long vendorId;
        private String vendorBusinessName;
        private String vendorPhone;
        private Long serviceId;
        private String serviceTitle;
        private String categoryName;
        private LocalDate bookingDate;
        private String timeSlot;
        private String address;
        private String notes;
        private BookingStatus status;
        private BigDecimal totalAmount;
        private String paymentMethod;
        private String paymentStatus;
        private Boolean reviewed;
        private String verificationCode;
        private BigDecimal discountAmount;
        private String promoCode;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder customerId(Long customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public Builder customerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public Builder vendorId(Long vendorId) { this.vendorId = vendorId; return this; }
        public Builder vendorBusinessName(String vendorBusinessName) { this.vendorBusinessName = vendorBusinessName; return this; }
        public Builder vendorPhone(String vendorPhone) { this.vendorPhone = vendorPhone; return this; }
        public Builder serviceId(Long serviceId) { this.serviceId = serviceId; return this; }
        public Builder serviceTitle(String serviceTitle) { this.serviceTitle = serviceTitle; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder bookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; return this; }
        public Builder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder status(BookingStatus status) { this.status = status; return this; }
        public Builder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public Builder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public Builder reviewed(Boolean reviewed) { this.reviewed = reviewed; return this; }
        public Builder verificationCode(String verificationCode) { this.verificationCode = verificationCode; return this; }
        public Builder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public Builder promoCode(String promoCode) { this.promoCode = promoCode; return this; }
        public Builder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public Builder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public BookingDto build() {
            return new BookingDto(id, customerId, customerName, customerEmail, customerPhone, vendorId, vendorBusinessName, vendorPhone, serviceId, serviceTitle, categoryName, bookingDate, timeSlot, address, notes, status, totalAmount, paymentMethod, paymentStatus, reviewed, verificationCode, discountAmount, promoCode, startedAt, completedAt, createdAt);
        }
    }
}
