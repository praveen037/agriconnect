package com.project.dto;

import java.time.LocalDateTime;

import com.project.enums.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String shopName;
    private String address;
    private String password; // mapped from User entity
    private String role; // String is safer for DTO
    private LocationDto location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ Rating fields
    private Double averageRating;
    private Integer ratingCount;

    // ✅ Approval status field
    private ApprovalStatus status;
}