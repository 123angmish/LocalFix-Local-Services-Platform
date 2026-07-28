package com.localfix.dto.dashboard;

import java.math.BigDecimal;

public class CustomerDashboardStats {
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private BigDecimal totalSpent;

    public CustomerDashboardStats() {}

    public CustomerDashboardStats(long totalBookings, long pendingBookings, long completedBookings, BigDecimal totalSpent) {
        this.totalBookings = totalBookings;
        this.pendingBookings = pendingBookings;
        this.completedBookings = completedBookings;
        this.totalSpent = totalSpent;
    }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }

    public long getCompletedBookings() { return completedBookings; }
    public void setCompletedBookings(long completedBookings) { this.completedBookings = completedBookings; }

    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalBookings;
        private long pendingBookings;
        private long completedBookings;
        private BigDecimal totalSpent;

        public Builder totalBookings(long totalBookings) { this.totalBookings = totalBookings; return this; }
        public Builder pendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; return this; }
        public Builder completedBookings(long completedBookings) { this.completedBookings = completedBookings; return this; }
        public Builder totalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; return this; }

        public CustomerDashboardStats build() {
            return new CustomerDashboardStats(totalBookings, pendingBookings, completedBookings, totalSpent);
        }
    }
}
