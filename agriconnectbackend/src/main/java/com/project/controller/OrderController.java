package com.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.dto.OrderDto;
import com.project.dto.OrderItemDto;
import com.project.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    // ✅ Place a new order
    @PostMapping("/place/{userId}")
    public ResponseEntity<OrderDto> placeOrder(
            @PathVariable Long userId,
            @RequestBody List<OrderItemDto> items) {
        return ResponseEntity.ok(orderService.placeOrder(userId, items));
    }

    // ✅ Checkout an order
    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkoutOrder(@PathVariable Long id) {
        try {
            boolean success = orderService.checkoutOrder(id);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Checkout successful"));
            } else {
                return ResponseEntity.status(400).body(Map.of("message", "Checkout failed"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ Mark order as paid manually (fallback)
    @PostMapping("/{orderId}/mark-paid")
    public ResponseEntity<String> markPaid(
            @PathVariable Long orderId,
            @RequestParam String paymentId) {
        orderService.markOrderAsPaid(orderId, paymentId, paymentId);
        return ResponseEntity.ok("Order marked as PAID");
    }

    // ✅ Mark order as packed
    @PutMapping("/{orderId}/pack")
    public ResponseEntity<String> markOrderPacked(@PathVariable Long orderId) {
        orderService.markOrderAsPacked(orderId);
        return ResponseEntity.ok("Order marked as packed");
    }

    // ✅ Get all orders (admin)
    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ✅ Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    // ✅ Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Get orders by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    // ✅ Get paid orders for a vendor (multi-vendor aware)
    @GetMapping("/vendor/{vendorId}/paid")
    public ResponseEntity<List<OrderDto>> getPaidOrdersForVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(orderService.getPaidOrdersByVendor(vendorId));
    }
}