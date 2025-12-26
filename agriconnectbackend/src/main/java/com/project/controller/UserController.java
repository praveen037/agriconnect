package com.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.dto.LoginRequestDto;
import com.project.dto.UserDto;
import com.project.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // ==========================
    // Role-aware Registration
    // ==========================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto dto) {
    	String role = dto.getRole().name(); // Converts Role enum to String
        if (role == null) {
            return ResponseEntity.badRequest().body("Role is required");
        }

        switch (role.toUpperCase()) {
            case "USER":
                return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(dto));
            case "VENDOR":
                return ResponseEntity.status(HttpStatus.CREATED).body(userService.createVendor(dto));
            case "ADMIN":
                return ResponseEntity.status(HttpStatus.CREATED).body(userService.createAdmin(dto));
            default:
                return ResponseEntity.badRequest().body("Invalid role: " + role);
        }
    }

    // ==========================
    // Login
    // ==========================
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto request) {
        UserDto dto = userService.login(request);
        return ResponseEntity.ok(dto);
    }

    // ==========================
    // Read Operations
    // ==========================
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ==========================
    // Update
    // ==========================
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    // ==========================
    // Delete
    // ==========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}