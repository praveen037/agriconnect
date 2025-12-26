package com.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.dto.CartDto;
import com.project.dto.CartItemRequest;
import com.project.entity.ApiResponse;
import com.project.service.CartService;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    // ✅ Get cart by userId
    @GetMapping("/{userId}")
    public ResponseEntity<CartDto> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    // ✅ Add item to cart
    @PostMapping("/{userId}/add")
    public ResponseEntity<CartDto> addItem(
            @PathVariable Long userId,
            @RequestBody CartItemRequest request) {
        if (request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(cartService.addItemToCart(userId, request.getProductId(), request.getQuantity()));
    }

    // ✅ Update item quantity
    @PutMapping("/{userId}/update")
    public ResponseEntity<CartDto> updateItem(
            @PathVariable Long userId,
            @RequestBody CartItemRequest request) {
        if (request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, request.getProductId(), request.getQuantity()));
    }

    // ✅ Clear cart
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<ApiResponse> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(new ApiResponse("Cart cleared successfully", true));
    }

    // ✅ Optional: Remove single item
    @DeleteMapping("/{userId}/remove")
    public ResponseEntity<CartDto> removeItem(
            @PathVariable Long userId,
            @RequestParam Long productId) {
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, productId, 0));
    }
}