package com.localfix.dto.auth;

import com.localfix.model.Role;
import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private boolean enabled;
    private Long vendorProfileId;
    private String businessName;
    private boolean approved;
    private LocalDateTime createdAt;

    public UserDto() {}

    public UserDto(Long id, String name, String email, String phone, Role role, boolean enabled, Long vendorProfileId, String businessName, boolean approved, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.enabled = enabled;
        this.vendorProfileId = vendorProfileId;
        this.businessName = businessName;
        this.approved = approved;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public Long getVendorProfileId() { return vendorProfileId; }
    public void setVendorProfileId(Long vendorProfileId) { this.vendorProfileId = vendorProfileId; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static UserDtoBuilder builder() { return new UserDtoBuilder(); }

    public static class UserDtoBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;
        private boolean enabled = true;
        private Long vendorProfileId;
        private String businessName;
        private boolean approved;
        private LocalDateTime createdAt;

        public UserDtoBuilder id(Long id) { this.id = id; return this; }
        public UserDtoBuilder name(String name) { this.name = name; return this; }
        public UserDtoBuilder email(String email) { this.email = email; return this; }
        public UserDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public UserDtoBuilder role(Role role) { this.role = role; return this; }
        public UserDtoBuilder enabled(boolean enabled) { this.enabled = enabled; return this; }
        public UserDtoBuilder vendorProfileId(Long vendorProfileId) { this.vendorProfileId = vendorProfileId; return this; }
        public UserDtoBuilder businessName(String businessName) { this.businessName = businessName; return this; }
        public UserDtoBuilder approved(boolean approved) { this.approved = approved; return this; }
        public UserDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public UserDto build() {
            return new UserDto(id, name, email, phone, role, enabled, vendorProfileId, businessName, approved, createdAt);
        }
    }
}
