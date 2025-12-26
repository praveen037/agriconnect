package com.project.dto;

import java.time.LocalDateTime;

import com.project.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String password;
    private String address;

    private Role role;
    private String roleName;
    private Long roleId;
    private LocalDateTime createdAt;

    // Vendor-specific
    private String shopName;
    private LocationDto location;
    private Long vendorId;
}