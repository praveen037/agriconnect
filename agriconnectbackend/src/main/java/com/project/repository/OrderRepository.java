package com.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.entity.Order;
import com.project.entity.User;
import com.project.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // 🔍 Orders by User entity
    List<Order> findByUser(User user);

    // 🔍 Orders by User ID (custom query)
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserId(@Param("userId") Long userId);

    // 🔍 Razorpay order lookup
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    // ✅ Multi-vendor: Paid orders containing products from a specific vendor
    @Query("""
        SELECT DISTINCT o
        FROM Order o
        JOIN o.orderItems oi
        WHERE oi.product.vendor.id = :vendorId
          AND o.orderStatus = :status
        ORDER BY o.createdAt DESC
    """)
    List<Order> findPaidOrdersByVendor(@Param("vendorId") Long vendorId, @Param("status") OrderStatus status);
}