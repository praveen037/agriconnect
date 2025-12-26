package com.project.dto;

import lombok.Data;

@Data
public class OrderItemDto {
    private Long id;
    private Integer quantity;
    private Double price;

    // ✅ Optional: full product object for detailed views
    private ProductDto product;

    // ✅ Packing status for vendor dashboard
    private boolean packed;

    // ✅ Vendor-aware filtering
    private Long productId;
    private String productName;
    private Long vendorId;

    // ✅ Optional: for category-based filtering (e.g. grains, vegetables)
    private String categoryName;
}