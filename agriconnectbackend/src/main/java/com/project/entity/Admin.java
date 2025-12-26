package com.project.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Admin {

    @Id
    private Long id; // same as user.id

    @OneToOne
    @MapsId
    @JoinColumn(name = "id") // maps Admin.id to User.id
    private User user;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String mobileNumber;

    @Enumerated(EnumType.STRING)
    private com.project.enums.Role role = com.project.enums.Role.ADMIN;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}