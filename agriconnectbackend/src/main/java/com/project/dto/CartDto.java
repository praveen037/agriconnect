package com.project.dto;

import java.util.List;

import lombok.Data;

@Data
public class CartDto {
	    private Long id;
	    private Long userId;  
	    private List<CartItemDto> items; 
	    private double totalPrice;
}
