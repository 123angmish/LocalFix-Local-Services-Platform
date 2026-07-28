package com.localfix.service;

import com.localfix.dto.dashboard.AdminDashboardStats;
import com.localfix.dto.dashboard.CustomerDashboardStats;
import com.localfix.dto.dashboard.VendorDashboardStats;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.Booking;
import com.localfix.model.BookingStatus;
import com.localfix.model.VendorProfile;
import com.localfix.repository.BookingRepository;
import com.localfix.repository.ServiceRepository;
import com.localfix.repository.UserRepository;
import com.localfix.repository.VendorProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    public DashboardService(UserRepository userRepository, VendorProfileRepository vendorProfileRepository, BookingRepository bookingRepository, ServiceRepository serviceRepository) {
        this.userRepository = userRepository;
        this.vendorProfileRepository = vendorProfileRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
    }

    public AdminDashboardStats getAdminDashboardStats() {
        long totalUsers = userRepository.count();
        long totalVendors = vendorProfileRepository.count();
        long pendingVendorApprovals = vendorProfileRepository.findByApproved(false).size();
        long totalBookings = bookingRepository.count();
        long totalServices = serviceRepository.count();

        BigDecimal totalRevenue = bookingRepository.findByStatus(BookingStatus.COMPLETED).stream()
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .totalVendors(totalVendors)
                .pendingVendorApprovals(pendingVendorApprovals)
                .totalBookings(totalBookings)
                .totalServices(totalServices)
                .totalRevenue(totalRevenue)
                .build();
    }

    public VendorDashboardStats getVendorDashboardStats(Long vendorUserId) {
        VendorProfile vendor = vendorProfileRepository.findByUserId(vendorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found for user id: " + vendorUserId));

        List<Booking> vendorBookings = bookingRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());

        long totalBookings = vendorBookings.size();
        long pendingBookings = vendorBookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long completedBookings = vendorBookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();

        BigDecimal totalEarnings = vendorBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalServices = serviceRepository.findByVendorId(vendor.getId()).size();

        return VendorDashboardStats.builder()
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .completedBookings(completedBookings)
                .totalEarnings(totalEarnings)
                .averageRating(vendor.getRating())
                .totalReviews(vendor.getTotalReviews())
                .totalServices(totalServices)
                .build();
    }

    public CustomerDashboardStats getCustomerDashboardStats(Long customerUserId) {
        List<Booking> customerBookings = bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerUserId);

        long totalBookings = customerBookings.size();
        long pendingBookings = customerBookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long completedBookings = customerBookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();

        BigDecimal totalSpent = customerBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CustomerDashboardStats.builder()
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .completedBookings(completedBookings)
                .totalSpent(totalSpent)
                .build();
    }
}
