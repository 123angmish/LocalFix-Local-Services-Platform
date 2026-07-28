package com.localfix.dto.dashboard;

import java.math.BigDecimal;

public class VendorDashboardStats {
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private BigDecimal totalEarnings;
    private Double averageRating;
    private Integer totalReviews;
    private long totalServices;

    public VendorDashboardStats() {}

    public VendorDashboardStats(long totalBookings, long pendingBookings, long completedBookings, BigDecimal totalEarnings, Double averageRating, Integer totalReviews, long totalServices) {
        this.totalBookings = totalBookings;
        this.pendingBookings = pendingBookings;
        this.completedBookings = completedBookings;
        this.totalEarnings = totalEarnings;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.totalServices = totalServices;
    }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }

    public long getCompletedBookings() { return completedBookings; }
    public void setCompletedBookings(long completedBookings) { this.completedBookings = completedBookings; }

    public BigDecimal getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(BigDecimal totalEarnings) { this.totalEarnings = totalEarnings; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public long getTotalServices() { return totalServices; }
    public void setTotalServices(long totalServices) { this.totalServices = totalServices; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalBookings;
        private long pendingBookings;
        private long completedBookings;
        private BigDecimal totalEarnings;
        private Double averageRating;
        private Integer totalReviews;
        private long totalServices;

        public Builder totalBookings(long totalBookings) { this.totalBookings = totalBookings; return this; }
        public Builder pendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; return this; }
        public Builder completedBookings(long completedBookings) { this.completedBookings = completedBookings; return this; }
        public Builder totalEarnings(BigDecimal totalEarnings) { this.totalEarnings = totalEarnings; return this; }
        public Builder averageRating(Double averageRating) { this.averageRating = averageRating; return this; }
        public Builder totalReviews(Integer totalReviews) { this.totalReviews = totalReviews; return this; }
        public Builder totalServices(long totalServices) { this.totalServices = totalServices; return this; }

        public VendorDashboardStats build() {
            return new VendorDashboardStats(totalBookings, pendingBookings, completedBookings, totalEarnings, averageRating, totalReviews, totalServices);
        }
    }
}
