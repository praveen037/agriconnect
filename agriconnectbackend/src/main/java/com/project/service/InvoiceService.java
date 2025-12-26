package com.project.service;

import com.project.entity.Order;
import com.project.repository.OrderRepository;
import com.project.util.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    @Autowired
    private OrderRepository orderRepository;

    public byte[] generateInvoice(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        return PdfGenerator.buildInvoicePdf(order);
    }
}