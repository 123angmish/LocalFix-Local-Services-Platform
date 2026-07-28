package com.localfix.dto.dashboard;

import java.math.BigDecimal;

public class AdminDashboardStats {
    private long totalUsers;
    private long totalVendors;
    private long pendingVendorApprovals;
    private long totalBookings;
    private long totalServices;
    private BigDecimal totalRevenue;

    public AdminDashboardStats() {}

    public AdminDashboardStats(long totalUsers, long totalVendors, long pendingVendorApprovals, long totalBookings, long totalServices, BigDecimal totalRevenue) {
        this.totalUsers = totalUsers;
        this.totalVendors = totalVendors;
        this.pendingVendorApprovals = pendingVendorApprovals;
        this.totalBookings = totalBookings;
        this.totalServices = totalServices;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalVendors() { return totalVendors; }
    public void setTotalVendors(long totalVendors) { this.totalVendors = totalVendors; }

    public long getPendingVendorApprovals() { return pendingVendorApprovals; }
    public void setPendingVendorApprovals(long pendingVendorApprovals) { this.pendingVendorApprovals = pendingVendorApprovals; }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getTotalServices() { return totalServices; }
    public void setTotalServices(long totalServices) { this.totalServices = totalServices; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalUsers;
        private long totalVendors;
        private long pendingVendorApprovals;
        private long totalBookings;
        private long totalServices;
        private BigDecimal totalRevenue;

        public Builder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
        public Builder totalVendors(long totalVendors) { this.totalVendors = totalVendors; return this; }
        public Builder pendingVendorApprovals(long pendingVendorApprovals) { this.pendingVendorApprovals = pendingVendorApprovals; return this; }
        public Builder totalBookings(long totalBookings) { this.totalBookings = totalBookings; return this; }
        public Builder totalServices(long totalServices) { this.totalServices = totalServices; return this; }
        public Builder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }

        public AdminDashboardStats build() {
            return new AdminDashboardStats(totalUsers, totalVendors, pendingVendorApprovals, totalBookings, totalServices, totalRevenue);
        }
    }
}
