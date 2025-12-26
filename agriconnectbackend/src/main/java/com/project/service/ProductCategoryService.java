package com.project.service;

import java.util.List;
import com.project.dto.ProductCategoryDto;

public interface ProductCategoryService {

    ProductCategoryDto createCategory(ProductCategoryDto dto);

    ProductCategoryDto updateCategory(Long id, ProductCategoryDto dto);

    void deleteCategory(Long id);

    ProductCategoryDto getCategoryById(Long id);

    List<ProductCategoryDto> getAllCategories();
}
