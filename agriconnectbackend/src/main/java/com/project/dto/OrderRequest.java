// dto/OrderRequest.java
package com.project.dto;

import java.util.List;

import com.project.entity.CartItem;

import lombok.Data;

@Data
public class OrderRequest {
    private Long userId;
    private String paymentId;
    private List<CartItem> cart;
}
