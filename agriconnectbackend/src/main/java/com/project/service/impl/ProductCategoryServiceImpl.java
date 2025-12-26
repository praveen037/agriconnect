package com.project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.dto.ProductCategoryDto;
import com.project.entity.ProductCategory;
import com.project.repository.ProductCategoryRepository;
import com.project.service.ProductCategoryService;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ProductCategoryDto createCategory(ProductCategoryDto dto) {
        ProductCategory category = modelMapper.map(dto, ProductCategory.class);
        return modelMapper.map(categoryRepository.save(category), ProductCategoryDto.class);
    }

    @Override
    public ProductCategoryDto updateCategory(Long id, ProductCategoryDto dto) {
        ProductCategory existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setCategoryName(dto.getCategoryName());

        return modelMapper.map(categoryRepository.save(existing), ProductCategoryDto.class);
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public ProductCategoryDto getCategoryById(Long id) {
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return modelMapper.map(category, ProductCategoryDto.class);
    }

    @Override
    public List<ProductCategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(cat -> modelMapper.map(cat, ProductCategoryDto.class))
                .collect(Collectors.toList());
    }
}
