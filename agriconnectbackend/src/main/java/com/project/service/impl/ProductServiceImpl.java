package com.project.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.dto.ProductDto;
import com.project.entity.Product;
import com.project.entity.ProductCategory;
import com.project.entity.Vendor;
import com.project.enums.OrderStatus;
import com.project.repository.OrderItemRepository;
import com.project.repository.ProductCategoryRepository;
import com.project.repository.ProductRepository;
import com.project.repository.VendorRepository;
import com.project.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private ProductCategoryRepository categoryRepository;
    @Autowired private VendorRepository vendorRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private ModelMapper modelMapper;

    @Override
    public ProductDto saveProduct(ProductDto dto, MultipartFile file) {
        Product product = toEntity(dto);
        if (file != null && !file.isEmpty()) {
            String storedPath = storeFile(file);
            product.setImage(storedPath);
        }
        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto dto, MultipartFile file) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

        existing.setProductName(dto.getProductName());
        existing.setProductQuantity(dto.getProductQuantity());
        existing.setCost(dto.getCost());
        existing.setUnit(dto.getUnit());
        existing.setDescription(dto.getDescription());
        existing.setStockQuantity(dto.getStockQuantity());

        if (file != null && !file.isEmpty()) {
            String storedPath = storeFile(file);
            existing.setImage(storedPath);
        }

        if (dto.getVendorId() != null) {
            Vendor vendor = vendorRepository.findById(dto.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));
            existing.setVendor(vendor);
        }

        if (dto.getCategoryId() != null) {
            ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(category);
        }

        Product updated = productRepository.save(existing);
        return toDto(updated);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
        return toDto(product);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDto> getProductsByVendor(Long vendorId) {
        List<Product> products = productRepository.findByVendorId(vendorId);
        return products.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void updateProductOrderStatusFlags(List<ProductDto> products) {
        for (ProductDto dto : products) {
            boolean hasPaidOrder = orderItemRepository.existsByProduct_IdAndOrder_OrderStatus(
                dto.getId(), OrderStatus.PAID
            );
            dto.setOrderedAndPaid(hasPaidOrder);
        }
    }

    private Product toEntity(ProductDto dto) {
        Product product = modelMapper.map(dto, Product.class);

        if (dto.getCategoryId() != null) {
            ProductCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        if (dto.getVendorId() != null) {
            Vendor vendor = vendorRepository.findById(dto.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));
            product.setVendor(vendor);
        }

        return product;
    }

    private ProductDto toDto(Product product) {
        ProductDto dto = modelMapper.map(product, ProductDto.class);

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
        }
        if (product.getVendor() != null) {
            dto.setVendorId(product.getVendor().getId());
        }

        boolean hasPaidOrder = orderItemRepository.existsByProduct_IdAndOrder_OrderStatus(
                product.getId(), OrderStatus.PAID);
        dto.setOrderedAndPaid(hasPaidOrder);

        return dto;
    }

    private String storeFile(MultipartFile file) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/products/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            return "/uploads/products/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}