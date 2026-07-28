package com.localfix.config;

import com.localfix.model.*;
import com.localfix.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, ServiceCategoryRepository categoryRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
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

        log.info("Database initial setup complete. Ready for real user entries.");
    }
}
