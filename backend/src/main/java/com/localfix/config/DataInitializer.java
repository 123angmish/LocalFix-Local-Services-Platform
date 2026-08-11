package com.localfix.config;

import com.localfix.model.*;
import com.localfix.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, ServiceCategoryRepository categoryRepository, VendorProfileRepository vendorProfileRepository, ServiceRepository serviceRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.vendorProfileRepository = vendorProfileRepository;
        this.serviceRepository = serviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Service Categories
        ServiceCategory plumberCat = null;
        ServiceCategory electricCat = null;
        ServiceCategory salonCat = null;
        ServiceCategory tutorCat = null;
        ServiceCategory cleanerCat = null;
        ServiceCategory applianceCat = null;

        if (categoryRepository.count() == 0) {
            log.info("Initializing essential service categories...");

            plumberCat = categoryRepository.save(ServiceCategory.builder()
                    .name("Plumber")
                    .description("Leak fixing, tap installation, pipe repair, and drainage solutions.")
                    .icon("Wrench")
                    .build());

            electricCat = categoryRepository.save(ServiceCategory.builder()
                    .name("Electrician")
                    .description("Wiring, fan & light installation, switchboard repair, and power backup.")
                    .icon("Zap")
                    .build());

            salonCat = categoryRepository.save(ServiceCategory.builder()
                    .name("Salon")
                    .description("Home salon & spa treatments, haircuts, facials, and grooming.")
                    .icon("Scissors")
                    .build());

            tutorCat = categoryRepository.save(ServiceCategory.builder()
                    .name("Tutor")
                    .description("Home tutoring for Math, Science, Languages, and exam prep.")
                    .icon("BookOpen")
                    .build());

            cleanerCat = categoryRepository.save(ServiceCategory.builder()
                    .name("Cleaner")
                    .description("Deep home cleaning, sofa & carpet shampooing, and kitchen sanitization.")
                    .icon("Sparkles")
                    .build());

            applianceCat = categoryRepository.save(ServiceCategory.builder()
                    .name("Appliance Repair")
                    .description("AC servicing, refrigerator repair, washing machine & microwave fixes.")
                    .icon("Shield")
                    .build());
        } else {
            plumberCat = categoryRepository.findByName("Plumber").orElse(null);
            electricCat = categoryRepository.findByName("Electrician").orElse(null);
            salonCat = categoryRepository.findByName("Salon").orElse(null);
            tutorCat = categoryRepository.findByName("Tutor").orElse(null);
            cleanerCat = categoryRepository.findByName("Cleaner").orElse(null);
            applianceCat = categoryRepository.findByName("Appliance Repair").orElse(null);
        }

        // 2. Initialize Admin User
        if (!userRepository.existsByEmail("admin@localfix.com")) {
            userRepository.save(User.builder()
                    .name("System Admin")
                    .email("admin@localfix.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("+91 9876543210")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build());
        }

        // 3. Initialize Demo Customer User
        User customerUser = userRepository.findByEmail("customer@localfix.com").orElse(null);
        if (customerUser == null) {
            customerUser = userRepository.save(User.builder()
                    .name("Rahul Sharma")
                    .email("customer@localfix.com")
                    .password(passwordEncoder.encode("Customer@123"))
                    .phone("+91 9811223344")
                    .role(Role.CUSTOMER)
                    .enabled(true)
                    .build());
        }

        // 4. Initialize Demo Vendor Users & Profiles
        User vendorUser1 = userRepository.findByEmail("vendor@localfix.com").orElse(null);
        if (vendorUser1 == null) {
            vendorUser1 = userRepository.save(User.builder()
                    .name("Vikram Verma")
                    .email("vendor@localfix.com")
                    .password(passwordEncoder.encode("Vendor@123"))
                    .phone("+91 9899001122")
                    .role(Role.VENDOR)
                    .enabled(true)
                    .build());
        }

        VendorProfile vendorProfile1 = vendorProfileRepository.findByUserId(vendorUser1.getId()).orElse(null);
        if (vendorProfile1 == null) {
            vendorProfile1 = vendorProfileRepository.save(VendorProfile.builder()
                    .user(vendorUser1)
                    .businessName("Verma Plumbing & Hardware Solutions")
                    .description("Expert plumbing, pipe leakage fixing, and tap replacement in Mumbai & Delhi.")
                    .city("Mumbai")
                    .address("Goregaon East, Mumbai")
                    .approved(true)
                    .rating(4.9)
                    .totalReviews(24)
                    .build());
        }

        User vendorUser2 = userRepository.findByEmail("apex.plumbing@localfix.com").orElse(null);
        if (vendorUser2 == null) {
            vendorUser2 = userRepository.save(User.builder()
                    .name("Ramesh Kumar")
                    .email("apex.plumbing@localfix.com")
                    .password(passwordEncoder.encode("Vendor@123"))
                    .phone("+91 9822334455")
                    .role(Role.VENDOR)
                    .enabled(true)
                    .build());
        }

        VendorProfile vendorProfile2 = vendorProfileRepository.findByUserId(vendorUser2.getId()).orElse(null);
        if (vendorProfile2 == null) {
            vendorProfile2 = vendorProfileRepository.save(VendorProfile.builder()
                    .user(vendorUser2)
                    .businessName("Apex Home Electricals & Repair")
                    .description("Certified electrician for house wiring, MCB switches, and ceiling fans.")
                    .city("Mumbai")
                    .address("Andheri West, Mumbai")
                    .approved(true)
                    .rating(4.8)
                    .totalReviews(18)
                    .build());
        }

        // 5. Initialize Demo Service Items
        if (serviceRepository.count() == 0) {
            log.info("Seeding initial demo services...");

            if (plumberCat != null && vendorProfile1 != null) {
                serviceRepository.save(ServiceItem.builder()
                        .vendor(vendorProfile1)
                        .category(plumberCat)
                        .title("Emergency Tap Leakage & Pipe Repair")
                        .description("30-min urgent response for water pipe bursts, tap leakages, and bathroom drainage unblocking.")
                        .price(new BigDecimal("199"))
                        .city("Mumbai")
                        .durationMinutes(45)
                        .imageUrl("https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80")
                        .active(true)
                        .build());
            }

            if (electricCat != null && vendorProfile2 != null) {
                serviceRepository.save(ServiceItem.builder()
                        .vendor(vendorProfile2)
                        .category(electricCat)
                        .title("Complete Switchboard & Circuit Breaker Repair")
                        .description("Fixing short circuits, replacing damaged MCB switches, and installing LED lights.")
                        .price(new BigDecimal("299"))
                        .city("Mumbai")
                        .durationMinutes(60)
                        .imageUrl("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80")
                        .active(true)
                        .build());
            }

            if (cleanerCat != null && vendorProfile1 != null) {
                serviceRepository.save(ServiceItem.builder()
                        .vendor(vendorProfile1)
                        .category(cleanerCat)
                        .title("Full Kitchen & Bathroom Deep Sanitization")
                        .description("Professional deep cleaning of tile stains, oil grease, exhaust fans, and bathroom fittings.")
                        .price(new BigDecimal("499"))
                        .city("Mumbai")
                        .durationMinutes(120)
                        .imageUrl("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80")
                        .active(true)
                        .build());
            }

            if (applianceCat != null && vendorProfile2 != null) {
                serviceRepository.save(ServiceItem.builder()
                        .vendor(vendorProfile2)
                        .category(applianceCat)
                        .title("AC Gas Charging & Foam Jet Servicing")
                        .description("Split/Window AC deep foam cleaning, filter wash, and gas pressure check.")
                        .price(new BigDecimal("599"))
                        .city("Mumbai")
                        .durationMinutes(90)
                        .imageUrl("https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80")
                        .active(true)
                        .build());
            }
        }

        log.info("Database initial setup complete. Initial demo services ready for instant booking.");
    }
}
