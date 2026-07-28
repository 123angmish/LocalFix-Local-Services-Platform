package com.localfix.dto.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceDto {
    private Long id;
    private Long vendorId;
    private String vendorBusinessName;
    private String vendorCity;
    private String vendorPhone;
    private String vendorEmail;
    private Double vendorRating;
    private Integer vendorTotalReviews;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private String title;
    private String description;
    private BigDecimal price;
    private String city;
    private Integer durationMinutes;
    private boolean active;
    private LocalDateTime createdAt;

    public ServiceDto() {}

    public ServiceDto(Long id, Long vendorId, String vendorBusinessName, String vendorCity, String vendorPhone, String vendorEmail, Double vendorRating, Integer vendorTotalReviews, Long categoryId, String categoryName, String categoryIcon, String title, String description, BigDecimal price, String city, Integer durationMinutes, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.vendorId = vendorId;
        this.vendorBusinessName = vendorBusinessName;
        this.vendorCity = vendorCity;
        this.vendorPhone = vendorPhone;
        this.vendorEmail = vendorEmail;
        this.vendorRating = vendorRating;
        this.vendorTotalReviews = vendorTotalReviews;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryIcon = categoryIcon;
        this.title = title;
        this.description = description;
        this.price = price;
        this.city = city;
        this.durationMinutes = durationMinutes;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }

    public String getVendorBusinessName() { return vendorBusinessName; }
    public void setVendorBusinessName(String vendorBusinessName) { this.vendorBusinessName = vendorBusinessName; }

    public String getVendorCity() { return vendorCity; }
    public void setVendorCity(String vendorCity) { this.vendorCity = vendorCity; }

    public String getVendorPhone() { return vendorPhone; }
    public void setVendorPhone(String vendorPhone) { this.vendorPhone = vendorPhone; }

    public String getVendorEmail() { return vendorEmail; }
    public void setVendorEmail(String vendorEmail) { this.vendorEmail = vendorEmail; }

    public Double getVendorRating() { return vendorRating; }
    public void setVendorRating(Double vendorRating) { this.vendorRating = vendorRating; }

    public Integer getVendorTotalReviews() { return vendorTotalReviews; }
    public void setVendorTotalReviews(Integer vendorTotalReviews) { this.vendorTotalReviews = vendorTotalReviews; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryIcon() { return categoryIcon; }
    public void setCategoryIcon(String categoryIcon) { this.categoryIcon = categoryIcon; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long vendorId;
        private String vendorBusinessName;
        private String vendorCity;
        private String vendorPhone;
        private String vendorEmail;
        private Double vendorRating;
        private Integer vendorTotalReviews;
        private Long categoryId;
        private String categoryName;
        private String categoryIcon;
        private String title;
        private String description;
        private BigDecimal price;
        private String city;
        private Integer durationMinutes;
        private boolean active;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder vendorId(Long vendorId) { this.vendorId = vendorId; return this; }
        public Builder vendorBusinessName(String vendorBusinessName) { this.vendorBusinessName = vendorBusinessName; return this; }
        public Builder vendorCity(String vendorCity) { this.vendorCity = vendorCity; return this; }
        public Builder vendorPhone(String vendorPhone) { this.vendorPhone = vendorPhone; return this; }
        public Builder vendorEmail(String vendorEmail) { this.vendorEmail = vendorEmail; return this; }
        public Builder vendorRating(Double vendorRating) { this.vendorRating = vendorRating; return this; }
        public Builder vendorTotalReviews(Integer vendorTotalReviews) { this.vendorTotalReviews = vendorTotalReviews; return this; }
        public Builder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder categoryIcon(String categoryIcon) { this.categoryIcon = categoryIcon; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ServiceDto build() {
            return new ServiceDto(id, vendorId, vendorBusinessName, vendorCity, vendorPhone, vendorEmail, vendorRating, vendorTotalReviews, categoryId, categoryName, categoryIcon, title, description, price, city, durationMinutes, active, createdAt);
        }
    }
}
