package com.project.service.impl;

import org.springframework.stereotype.Service;
import com.project.entity.Order;
import com.project.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendOrderConfirmation(Object request) {
        System.out.println("Order confirmation triggered for: " + request);
    }

    @Override
    public void sendPackingNotification(Order order) {
        String email = order.getUser().getEmail();
        String name = order.getUser().getFirstName();
        String subject = "Your order has been packed!";
        String message = "Hi " + name + ",\n\nYour order #" + order.getId() + " has been packed and is on its way.";

        System.out.println("Sending email to: " + email);
        System.out.println("Subject: " + subject);
        System.out.println("Message:\n" + message);
    }
}