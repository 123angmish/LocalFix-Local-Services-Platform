package com.localfix.service;

import com.localfix.dto.booking.BookingDto;
import com.localfix.dto.booking.CreateBookingRequest;
import com.localfix.model.*;
import com.localfix.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class BookingServiceTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorProfileRepository vendorProfileRepository;

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testCustomer;
    private ServiceItem testService;

    @BeforeEach
    void setUp() {
        testCustomer = userRepository.save(User.builder()
                .name("Test Customer")
                .email("cust_test@example.com")
                .password(passwordEncoder.encode("Password@123"))
                .phone("+91 9812345678")
                .role(Role.CUSTOMER)
                .enabled(true)
                .build());

        User vendorUser = userRepository.save(User.builder()
                .name("Test Vendor")
                .email("vendor_test@example.com")
                .password(passwordEncoder.encode("Password@123"))
                .phone("+91 9898989898")
                .role(Role.VENDOR)
                .enabled(true)
                .build());

        VendorProfile vendorProfile = vendorProfileRepository.save(VendorProfile.builder()
                .user(vendorUser)
                .businessName("Test Plumbing Co")
                .city("Mumbai")
                .approved(true)
                .build());

        ServiceCategory category = categoryRepository.save(ServiceCategory.builder()
                .name("Plumbing Test Category")
                .icon("Wrench")
                .build());

        testService = serviceRepository.save(ServiceItem.builder()
                .vendor(vendorProfile)
                .category(category)
                .title("Test Plumbing Service")
                .price(new BigDecimal("300"))
                .city("Mumbai")
                .active(true)
                .build());
    }

    @Test
    void testCreateBookingAndFetchCustomerBookings() {
        CreateBookingRequest request = new CreateBookingRequest();
        request.setServiceId(testService.getId());
        request.setBookingDate(LocalDate.now().plusDays(3));
        request.setTimeSlot("11:00 AM - 12:00 PM");
        request.setAddress("Test Address 123");
        request.setNotes("Please bring tools");
        request.setPaymentMethod("UPI");

        BookingDto dto = bookingService.createBooking(testCustomer.getId(), request);

        assertNotNull(dto);
        assertNotNull(dto.getId());
        assertEquals(BookingStatus.PENDING, dto.getStatus());

        List<BookingDto> customerBookings = bookingService.getCustomerBookings(testCustomer.getId());
        assertTrue(customerBookings.stream().anyMatch(b -> b.getId().equals(dto.getId())));
    }
}
