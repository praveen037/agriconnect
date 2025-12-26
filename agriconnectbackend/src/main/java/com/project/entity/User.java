package com.project.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.project.enums.ApprovalStatus;
import com.project.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // ✅ AUTO_INCREMENT in MySQL
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "mobile_number", unique = true, nullable = false)
    private String mobileNumber;

    private String password;

    private String address;

    // ✅ Maps to DATETIME or TIMESTAMP in MySQL
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String otp;

    // ✅ Enum stored as string (values: ADMIN, USER, VENDOR)
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Role role;

    // ✅ Vendor profile (optional)
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Vendor vendorProfile;

    // ✅ Orders list
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    // ✅ Cart relationship
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.APPROVED; // default for USER

}
