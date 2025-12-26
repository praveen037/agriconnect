package com.project.service;

import com.project.entity.Order;

public interface EmailService {
    void sendOrderConfirmation(Object request); // placeholder
    void sendPackingNotification(Order order);
}