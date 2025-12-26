package com.project.dto;

import lombok.Data;

@Data
public class AdminDto {
    private Long id; // same as user.id
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String mobileNumber;
    private String role; // "ADMIN"
}