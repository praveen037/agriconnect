package com.project.service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.project.dto.ProductDto;

public interface ProductService {

    ProductDto saveProduct(ProductDto dto, MultipartFile file);

    ProductDto updateProduct(Long id, ProductDto dto, MultipartFile file);

    List<ProductDto> getAllProducts();

    ProductDto getProductById(Long id);

    void deleteProduct(Long id);

    List<ProductDto> getProductsByVendor(Long vendorId);

    // ✅ Optional: if you want to expose a separate method for flagging paid orders
    void updateProductOrderStatusFlags(List<ProductDto> products);
}