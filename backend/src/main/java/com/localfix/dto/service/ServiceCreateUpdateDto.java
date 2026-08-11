package com.localfix.dto.service;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ServiceCreateUpdateDto {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;

    @NotBlank(message = "City is required")
    private String city;

    private Integer durationMinutes;

    private String imageUrl;

    private Boolean active = true;

    public ServiceCreateUpdateDto() {}

    public ServiceCreateUpdateDto(Long categoryId, String title, String description, BigDecimal price, String city, Integer durationMinutes, String imageUrl, Boolean active) {
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.price = price;
        this.city = city;
        this.durationMinutes = durationMinutes;
        this.imageUrl = imageUrl;
        this.active = active != null ? active : true;
    }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
