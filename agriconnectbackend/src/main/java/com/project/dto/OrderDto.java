package com.project.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.project.enums.OrderStatus;

import lombok.Data;

@Data
public class OrderDto {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private OrderStatus status;
    private Double totalAmount;

    private UserDto user;
    private List<OrderItemDto> orderItems;

    private String razorpayOrderId;
    private String paymentId;
    private boolean packed;

    private List<Long> vendorIds;

    // ✅ Optional: for category-level filtering or analytics
    private List<String> categoryNames;
}