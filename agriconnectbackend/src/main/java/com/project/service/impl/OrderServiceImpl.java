package com.project.service.impl;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.dto.*;
import com.project.entity.*;
import com.project.enums.OrderStatus;
import com.project.repository.*;
import com.project.service.EmailService;
import com.project.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired private EmailService emailService;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    @Override
    public void placeOrder(OrderRequest request) {
        emailService.sendOrderConfirmation(request);
    }

    @Override
    public OrderDto placeOrder(Long userId, List<OrderItemDto> items) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setTotalAmount(0.0);
        order.setPacked(false);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.setOrderItems(new ArrayList<>()); // ✅ Prevent null list

        double total = 0.0;
        for (OrderItemDto itemDto : items) {
            Product product = productRepository.findById(itemDto.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getCost());
            orderItem.setTotal(product.getCost() * itemDto.getQuantity());
            orderItem.setPacked(false);

            total += orderItem.getTotal();
            order.getOrderItems().add(orderItem);
        }

        order.setTotalAmount(total);
        order = orderRepository.save(order);

        return convertToDto(order);
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDto(order);
    }

    @Override
    public List<OrderDto> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found");
        }
        orderRepository.deleteById(id);
    }

    @Override
    public boolean checkoutOrder(Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) return false;

        Order order = optionalOrder.get();
        order.setOrderStatus(OrderStatus.COMPLETED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        return true;
    }

    @Override
    public void markOrderAsPaid(Long orderId, String razorpayOrderId, String paymentId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(OrderStatus.PAID);
        order.setRazorpayOrderId(razorpayOrderId);
        order.setPaymentId(paymentId);
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);

        for (OrderItem item : order.getOrderItems()) {
            Long vendorId = item.getProduct().getVendor().getId();
            messagingTemplate.convertAndSend(
                "/topic/order-paid/" + vendorId,
                "🛒 New order paid for: " + item.getProduct().getProductName()
            );
        }
    }

    @Override
    public void markOrderAsPacked(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPacked(true);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        emailService.sendPackingNotification(order);

        messagingTemplate.convertAndSend(
            "/topic/order-packed/" + order.getUser().getId(),
            "🎉 Your order #" + order.getId() + " has been packed!"
        );
    }

    @Override
    public void markItemAsPacked(Long orderId, Long itemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        boolean updated = false;

        for (OrderItem item : order.getOrderItems()) {
            if (item.getId().equals(itemId)) {
                item.setPacked(true);
                updated = true;

                Long vendorId = item.getProduct().getVendor().getId();
                messagingTemplate.convertAndSend(
                    "/topic/order-packed/" + vendorId,
                    "📦 Item packed: " + item.getProduct().getProductName()
                );
            }
        }

        if (updated) {
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Item not found in order or already packed");
        }
    }

    @Override
    public List<OrderDto> getPaidOrdersByVendor(Long vendorId) {
        List<Order> orders = orderRepository.findPaidOrdersByVendor(vendorId, OrderStatus.PAID);
        return orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        dto.setStatus(order.getOrderStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPacked(order.isPacked());
        dto.setRazorpayOrderId(order.getRazorpayOrderId());
        dto.setPaymentId(order.getPaymentId());

        User user = order.getUser();
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setMobileNumber(user.getMobileNumber());
        dto.setUser(userDto);

        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(oi -> {
            OrderItemDto oid = new OrderItemDto();
            oid.setId(oi.getId());
            oid.setQuantity(oi.getQuantity());
            oid.setPrice(oi.getPrice());
            oid.setProductId(oi.getProduct().getId());
            oid.setProductName(oi.getProduct().getProductName());
            oid.setVendorId(oi.getProduct().getVendor().getId());
            oid.setPacked(oi.isPacked());
            return oid;
        }).collect(Collectors.toList());
        dto.setOrderItems(itemDtos);

        Set<Long> vendorIds = itemDtos.stream()
                .map(OrderItemDto::getVendorId)
                .collect(Collectors.toSet());
        dto.setVendorIds(List.copyOf(vendorIds));

        return dto;
    }
}