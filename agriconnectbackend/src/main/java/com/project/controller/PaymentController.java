package com.project.controller;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.entity.Order;
import com.project.entity.User;
import com.project.enums.OrderStatus;
import com.project.repository.OrderRepository;
import com.project.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PaymentController {

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> body) {
        try {
            System.out.println("Incoming payment request: " + body);

            Object userIdObj = body.get("userId");
            Object amountObj = body.get("amount");

            if (userIdObj == null || amountObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing userId or amount"));
            }

            Long userId = Long.valueOf(String.valueOf(userIdObj));
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid userId"));
            }

            Integer amount;
            if (amountObj instanceof Integer) {
                amount = (Integer) amountObj;
            } else if (amountObj instanceof Double) {
                amount = ((Double) amountObj).intValue();
            } else if (amountObj instanceof String) {
                amount = Integer.parseInt((String) amountObj);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid amount type"));
            }

            if (amount <= 0) return ResponseEntity.badRequest().body(Map.of("error", "Amount must be > 0"));

            Order order = new Order();
            order.setUser(userOpt.get());
            order.setOrderStatus(OrderStatus.PENDING);
            order.setTotalAmount(amount / 100.0);
            order.setCreatedAt(LocalDateTime.now());
            order.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(order);

            Map<String, Object> orderReq = new HashMap<>();
            orderReq.put("amount", amount);
            orderReq.put("currency", "INR");
            String shortReceipt = "rcpt_" + UUID.randomUUID().toString().replace("-", "").substring(0, 32);
            orderReq.put("receipt", shortReceipt);
            orderReq.put("payment_capture", 1);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String auth = razorpayKeyId + ":" + razorpayKeySecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            headers.set("Authorization", "Basic " + encodedAuth);

            HttpEntity<String> request = new HttpEntity<>(mapper.writeValueAsString(orderReq), headers);
            ResponseEntity<String> response = rest.postForEntity("https://api.razorpay.com/v1/orders", request, String.class);

            System.out.println("Razorpay raw response: " + response.getBody());
            System.out.println("Razorpay status code: " + response.getStatusCode());

            if (!response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(response.getStatusCode())
                        .body(Map.of("error", "Razorpay API failed", "details", response.getBody()));
            }

            Map<String, Object> razorpayOrder = mapper.readValue(response.getBody(), Map.class);
            order.setRazorpayOrderId((String) razorpayOrder.get("id"));
            orderRepository.save(order);

            return ResponseEntity.ok(razorpayOrder);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> payload) {
        try {
            String razorpayOrderId = payload.get("razorpay_order_id");
            String paymentId = payload.get("razorpay_payment_id");
            String signature = payload.get("razorpay_signature");

            if (razorpayOrderId == null || paymentId == null || signature == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing parameters"));
            }

            String data = razorpayOrderId + "|" + paymentId;
            String expected = hmacSha256(data, razorpayKeySecret);

            if (expected.equals(signature)) {
                Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

                if (order.getOrderStatus() == OrderStatus.PAID) {
                    return ResponseEntity.ok(Map.of("status", "already_verified"));
                }

                order.setOrderStatus(OrderStatus.PAID);
                order.setPaymentId(paymentId);
                order.setUpdatedAt(LocalDateTime.now());
                orderRepository.save(order);

                String buyerName = order.getUser().getFirstName();
                String productSummary = order.getOrderItems().stream()
                        .map(oi -> oi.getProduct().getProductName() + " x" + oi.getQuantity())
                        .collect(Collectors.joining(", "));

                String message = "💰 New order #" + order.getId() + " paid by " + buyerName +
                        " for: " + productSummary;

                Set<Long> vendorIds = order.getOrderItems().stream()
                        .map(oi -> oi.getProduct().getVendor().getId())
                        .collect(Collectors.toSet());

                System.out.println("Notifying vendors: " + vendorIds);

                for (Long vendorId : vendorIds) {
                    messagingTemplate.convertAndSend("/topic/order-paid/" + vendorId, message);
                }

                messagingTemplate.convertAndSend("/topic/order-confirmed/" + order.getUser().getId(),
                        "🎉 Your payment for order #" + order.getId() + " was successful!");

                return ResponseEntity.ok(Map.of("status", "success"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("status", "invalid_signature"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private String hmacSha256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(2 * hash.length);
        for (byte b : hash) sb.append(String.format("%02x", b & 0xff));
        return sb.toString();
    }
}