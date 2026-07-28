package com.localfix.dto.review;

import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private Long bookingId;
    private Long customerId;
    private String customerName;
    private Long vendorId;
    private String vendorBusinessName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public ReviewDto(Long id, Long bookingId, Long customerId, String customerName, Long vendorId, String vendorBusinessName, Integer rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.vendorId = vendorId;
        this.vendorBusinessName = vendorBusinessName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }

    public String getVendorBusinessName() { return vendorBusinessName; }
    public void setVendorBusinessName(String vendorBusinessName) { this.vendorBusinessName = vendorBusinessName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long bookingId;
        private Long customerId;
        private String customerName;
        private Long vendorId;
        private String vendorBusinessName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public Builder customerId(Long customerId) { this.customerId = customerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder vendorId(Long vendorId) { this.vendorId = vendorId; return this; }
        public Builder vendorBusinessName(String vendorBusinessName) { this.vendorBusinessName = vendorBusinessName; return this; }
        public Builder rating(Integer rating) { this.rating = rating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ReviewDto build() {
            return new ReviewDto(id, bookingId, customerId, customerName, vendorId, vendorBusinessName, rating, comment, createdAt);
        }
    }
}
