package com.project.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class VendorRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating; // 1 to 5

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private Long userId; // optional for traceability
}