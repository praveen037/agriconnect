package com.project.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_quantity")
    private int productQuantity;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private double cost;

    @Column(length = 20)
    private String unit;

    private String image;

    @Column(name = "stock_quantity")
    private int stockQuantity;

    @ManyToOne
    @JoinColumn(name = "vendor_id")
    @JsonBackReference
    @ToString.Exclude
    private Vendor vendor;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonBackReference
    @ToString.Exclude
    private List<CartItem> cartItems;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category;

    // ✅ Alias for invoice generator
    public String getName() {
        return productName;
    }

    // ✅ Optional subtotal helper
    public double getSubtotal(int quantity) {
        return cost * quantity;
    }
}