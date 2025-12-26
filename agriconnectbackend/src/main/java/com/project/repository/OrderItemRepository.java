package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // ✅ Checks if any OrderItem exists for a product where the parent Order is PAID
    boolean existsByProduct_IdAndOrder_OrderStatus(Long productId, com.project.enums.OrderStatus orderStatus);
}