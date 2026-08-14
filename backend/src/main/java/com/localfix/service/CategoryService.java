package com.localfix.service;

import com.localfix.dto.service.CategoryDto;
import com.localfix.exception.BadRequestException;
import com.localfix.exception.ResourceNotFoundException;
import com.localfix.model.ServiceCategory;
import com.localfix.repository.ServiceCategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final ServiceCategoryRepository categoryRepository;

    public CategoryService(ServiceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .filter(c -> isCleanCategory(c.getName()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private boolean isCleanCategory(String name) {
        if (name == null || name.trim().length() < 3) return false;
        String clean = name.trim().toLowerCase();
        return !clean.contains("kzhd") && !clean.contains("ljafd") && !clean.contains("asdf") && !clean.contains("test");
    }

    public CategoryDto getCategoryById(Long id) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new BadRequestException("Category already exists with name: " + dto.getName());
        }

        ServiceCategory category = ServiceCategory.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .icon(dto.getIcon() != null ? dto.getIcon() : "Wrench")
                .build();

        return mapToDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        if (dto.getIcon() != null) {
            category.setIcon(dto.getIcon());
        }

        return mapToDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    public CategoryDto mapToDto(ServiceCategory category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .icon(category.getIcon())
                .build();
    }
}
