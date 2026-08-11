package com.localfix.service;

import com.localfix.dto.service.ServiceCreateUpdateDto;
import com.localfix.dto.service.ServiceDto;
import com.localfix.exception.BadRequestException;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.ServiceCategory;
import com.localfix.model.ServiceItem;
import com.localfix.model.VendorProfile;
import com.localfix.repository.ServiceCategoryRepository;
import com.localfix.repository.ServiceRepository;
import com.localfix.repository.VendorProfileRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceItemService {

    private final ServiceRepository serviceRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final VendorProfileRepository vendorProfileRepository;

    public ServiceItemService(ServiceRepository serviceRepository, ServiceCategoryRepository categoryRepository, VendorProfileRepository vendorProfileRepository) {
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
        this.vendorProfileRepository = vendorProfileRepository;
    }

    public List<ServiceDto> searchServices(String keyword, Long categoryId, String city, BigDecimal minPrice, BigDecimal maxPrice, Double minRating) {
        Specification<ServiceItem> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("active"), true));
            predicates.add(cb.equal(root.get("vendor").get("approved"), true));

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate titleLike = cb.like(cb.lower(root.get("title")), pattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), pattern);
                Predicate catLike = cb.like(cb.lower(root.get("category").get("name")), pattern);
                Predicate vendorLike = cb.like(cb.lower(root.get("vendor").get("businessName")), pattern);
                predicates.add(cb.or(titleLike, descLike, catLike, vendorLike));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (city != null && !city.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase()));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("vendor").get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return serviceRepository.findAll(spec).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ServiceDto getServiceById(Long id) {
        ServiceItem item = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        return mapToDto(item);
    }

    public List<ServiceDto> getServicesByVendorUserId(Long userId) {
        VendorProfile vendor = vendorProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found for user: " + userId));
        return serviceRepository.findByVendorId(vendor.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceDto createService(Long vendorUserId, ServiceCreateUpdateDto dto) {
        VendorProfile vendor = vendorProfileRepository.findByUserId(vendorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found for user id: " + vendorUserId));

        ServiceCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        ServiceItem item = ServiceItem.builder()
                .vendor(vendor)
                .category(category)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .city(dto.getCity())
                .durationMinutes(dto.getDurationMinutes() != null ? dto.getDurationMinutes() : 60)
                .imageUrl(dto.getImageUrl())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        return mapToDto(serviceRepository.save(item));
    }

    @Transactional
    public ServiceDto updateService(Long vendorUserId, Long serviceId, ServiceCreateUpdateDto dto) {
        ServiceItem item = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));

        if (!item.getVendor().getUser().getId().equals(vendorUserId)) {
            throw new BadRequestException("You are not authorized to update this service");
        }

        ServiceCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        item.setCategory(category);
        item.setTitle(dto.getTitle());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setCity(dto.getCity());
        item.setDurationMinutes(dto.getDurationMinutes());
        if (dto.getImageUrl() != null) {
            item.setImageUrl(dto.getImageUrl());
        }
        if (dto.getActive() != null) {
            item.setActive(dto.getActive());
        }

        return mapToDto(serviceRepository.save(item));
    }

    @Transactional
    public void deleteService(Long vendorUserId, Long serviceId) {
        ServiceItem item = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));

        if (!item.getVendor().getUser().getId().equals(vendorUserId)) {
            throw new BadRequestException("You are not authorized to delete this service");
        }

        serviceRepository.delete(item);
    }

    @Transactional
    public void resetVendorProfession(Long vendorUserId) {
        VendorProfile vendor = vendorProfileRepository.findByUserId(vendorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found for user id: " + vendorUserId));

        serviceRepository.deleteByVendorId(vendor.getId());
    }

    @Transactional
    public ServiceDto toggleServiceStatus(Long serviceId) {
        ServiceItem item = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + serviceId));
        item.setActive(!item.isActive());
        return mapToDto(serviceRepository.save(item));
    }

    public ServiceDto mapToDto(ServiceItem item) {
        return ServiceDto.builder()
                .id(item.getId())
                .vendorId(item.getVendor().getId())
                .vendorBusinessName(item.getVendor().getBusinessName())
                .vendorCity(item.getVendor().getCity())
                .vendorPhone(item.getVendor().getUser().getPhone())
                .vendorEmail(item.getVendor().getUser().getEmail())
                .vendorRating(item.getVendor().getRating())
                .vendorTotalReviews(item.getVendor().getTotalReviews())
                .categoryId(item.getCategory().getId())
                .categoryName(item.getCategory().getName())
                .categoryIcon(item.getCategory().getIcon())
                .title(item.getTitle())
                .description(item.getDescription())
                .price(item.getPrice())
                .city(item.getCity())
                .durationMinutes(item.getDurationMinutes())
                .imageUrl(item.getImageUrl())
                .active(item.isActive())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
