package com.localfix.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class RegisterVendorRequest {

    @NotBlank(message = "Owner Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Business Name is required")
    private String businessName;

    private String description;

    @NotBlank(message = "City is required")
    private String city;

    private String address;

    @NotBlank(message = "Job / Profession Title is required (e.g. Barber, Plumber)")
    private String professionTitle;

    @NotNull(message = "Price limit is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;

    private Long categoryId;

    public RegisterVendorRequest() {}

    public RegisterVendorRequest(String name, String email, String password, String phone, String businessName, String description, String city, String address, String professionTitle, BigDecimal price, Long categoryId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.businessName = businessName;
        this.description = description;
        this.city = city;
        this.address = address;
        this.professionTitle = professionTitle;
        this.price = price;
        this.categoryId = categoryId;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProfessionTitle() { return professionTitle; }
    public void setProfessionTitle(String professionTitle) { this.professionTitle = professionTitle; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
