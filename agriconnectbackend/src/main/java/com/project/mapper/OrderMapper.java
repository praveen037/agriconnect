package com.project.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.project.dto.OrderDto;
import com.project.dto.OrderItemDto;
import com.project.dto.UserDto;
import com.project.entity.Order;
import com.project.entity.OrderItem;

@Component
public class OrderMapper {

    public OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        dto.setStatus(order.getOrderStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setRazorpayOrderId(order.getRazorpayOrderId());
        dto.setPaymentId(order.getPaymentId());
        dto.setPacked(order.isPacked());

        // ✅ Map user
        UserDto userDto = new UserDto();
        userDto.setId(order.getUser().getId());
        userDto.setFirstName(order.getUser().getFirstName());
        userDto.setLastName(order.getUser().getLastName());
        userDto.setEmail(order.getUser().getEmail());
        userDto.setMobileNumber(order.getUser().getMobileNumber());
        dto.setUser(userDto);

        // ✅ Map order items
        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(this::mapOrderItem).collect(Collectors.toList());
        dto.setOrderItems(itemDtos);

        // ✅ Extract vendor IDs
        Set<Long> vendorIds = itemDtos.stream()
            .map(OrderItemDto::getVendorId)
            .collect(Collectors.toSet());
        dto.setVendorIds(List.copyOf(vendorIds));

        return dto;
    }

    private OrderItemDto mapOrderItem(OrderItem oi) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(oi.getId());
        dto.setQuantity(oi.getQuantity());
        dto.setProductId(oi.getProduct().getId());
        dto.setProductName(oi.getProduct().getProductName());
        dto.setVendorId(oi.getProduct().getVendor().getId());
        return dto;
    }
}