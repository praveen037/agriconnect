package com.project.service;

import java.util.List;

import com.project.dto.OrderDto;
import com.project.dto.OrderItemDto;
import com.project.dto.OrderRequest;

public interface OrderService {

    void placeOrder(OrderRequest request);

    OrderDto placeOrder(Long userId, List<OrderItemDto> items);

    List<OrderDto> getAllOrders();

    OrderDto getOrderById(Long id);

    List<OrderDto> getOrdersByUser(Long userId);

    void deleteOrder(Long id);

    boolean checkoutOrder(Long orderId);

    void markOrderAsPaid(Long orderId, String razorpayOrderId, String paymentId);

    void markOrderAsPacked(Long orderId);

    List<OrderDto> getPaidOrdersByVendor(Long vendorId);

    // ✅ NEW: Enables item-level packing for vendor dashboard
    void markItemAsPacked(Long orderId, Long itemId);
}