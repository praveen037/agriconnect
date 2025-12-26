package com.project.dto;

import lombok.Data;

@Data
public class CartItemDto {
	  private Long id;
	    private Long productId;
	    private String productName;
	    private String categoryName;
	    private int quantity;
	    private String image; 
	    private double price;
}
