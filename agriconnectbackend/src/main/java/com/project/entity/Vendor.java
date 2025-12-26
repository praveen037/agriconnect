package com.project.entity;

import java.time.LocalDateTime;

import com.project.enums.ApprovalStatus;
import com.project.enums.Role;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vendors")
public class Vendor {

    @Id
    private Long id; // same as user.id

    @OneToOne
    @MapsId
    @JoinColumn(name = "id") // maps Vendor.id to User.id
    private User user;

    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String shopName;
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus status;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    private Double averageRating = 0.0;
    private Integer ratingCount = 0;

    public String getPassword() {
        return user != null ? user.getPassword() : null;
    }

    public void setPassword(String password) {
        if (user != null) {
            user.setPassword(password);
        }
    }
}