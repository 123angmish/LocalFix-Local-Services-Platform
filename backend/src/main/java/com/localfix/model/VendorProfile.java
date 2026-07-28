package com.localfix.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vendor_profiles")
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String businessName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String city;

    private String address;

    @Column(nullable = false)
    private boolean approved = false;

    @Column(nullable = false)
    private Double rating = 0.0;

    @Column(nullable = false)
    private Integer totalReviews = 0;

    public VendorProfile() {}

    public VendorProfile(Long id, User user, String businessName, String description, String city, String address, boolean approved, Double rating, Integer totalReviews) {
        this.id = id;
        this.user = user;
        this.businessName = businessName;
        this.description = description;
        this.city = city;
        this.address = address;
        this.approved = approved;
        this.rating = rating != null ? rating : 0.0;
        this.totalReviews = totalReviews != null ? totalReviews : 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private String businessName;
        private String description;
        private String city;
        private String address;
        private boolean approved = false;
        private Double rating = 0.0;
        private Integer totalReviews = 0;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder businessName(String businessName) { this.businessName = businessName; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder approved(boolean approved) { this.approved = approved; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }
        public Builder totalReviews(Integer totalReviews) { this.totalReviews = totalReviews; return this; }

        public VendorProfile build() {
            return new VendorProfile(id, user, businessName, description, city, address, approved, rating, totalReviews);
        }
    }
}
