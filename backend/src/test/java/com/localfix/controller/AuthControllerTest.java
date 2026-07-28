package com.localfix.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.localfix.dto.auth.AuthRequest;
import com.localfix.dto.auth.RegisterCustomerRequest;
import com.localfix.model.Role;
import com.localfix.model.User;
import com.localfix.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        if (!userRepository.existsByEmail("testcustomer@localfix.com")) {
            userRepository.save(User.builder()
                    .name("Test Customer")
                    .email("testcustomer@localfix.com")
                    .password(passwordEncoder.encode("Customer@123"))
                    .phone("+91 9812345678")
                    .role(Role.CUSTOMER)
                    .enabled(true)
                    .build());
        }
    }

    @Test
    void testLoginWithSeededCustomer() throws Exception {
        AuthRequest request = new AuthRequest();
        request.setEmail("testcustomer@localfix.com");
        request.setPassword("Customer@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("testcustomer@localfix.com"));
    }

    @Test
    void testRegisterNewCustomer() throws Exception {
        RegisterCustomerRequest request = new RegisterCustomerRequest();
        request.setName("Test User");
        request.setEmail("newuser@example.com");
        request.setPassword("Password@123");
        request.setPhone("+91 9998887776");

        mockMvc.perform(post("/api/auth/register/customer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("newuser@example.com"));
    }
}
