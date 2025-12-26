package com.project.service;

import com.project.dto.CartDto;

public interface CartService {
    CartDto getCartByUserId(Long userId);
    CartDto addItemToCart(Long userId, Long productId, int quantity);
    CartDto updateItemQuantity(Long userId, Long productId, int quantity);
    void clearCart(Long userId);
}
