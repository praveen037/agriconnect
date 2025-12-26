package com.project.dto;

import lombok.Data;

@Data
public class ProductDto {
    private Long id;
    private String productName;
    private int productQuantity;
    private double cost;
    private String unit;
    private String image;
    private String description;
    private int stockQuantity;

    private Long categoryId;
    private Long vendorId;

    
    private boolean isOrderedAndPaid;

 
}
