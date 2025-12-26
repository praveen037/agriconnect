package com.project.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.AdminDto;
import com.project.dto.LoginRequestDto;
import com.project.dto.VendorDto;
import com.project.service.AdminService;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ModelMapper mapper;

    @PostMapping("/register")
    public ResponseEntity<AdminDto> registerAdmin(@RequestBody AdminDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.registerAdmin(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequestDto request) {
        try {
            return ResponseEntity.ok(adminService.loginAdmin(request.getEmail(), request.getPassword()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PutMapping("/approve/vendor/{id}")
    public ResponseEntity<String> approveVendor(@PathVariable Long id) {
        adminService.approveVendor(id);
        return ResponseEntity.ok("Vendor approved successfully");
    }

    @PutMapping("/reject/vendor/{id}")
    public ResponseEntity<String> rejectVendor(@PathVariable Long id) {
        adminService.rejectVendor(id);
        return ResponseEntity.ok("Vendor rejected");
    }

    @GetMapping("/pending/vendors")
    public ResponseEntity<List<VendorDto>> getPendingVendors() {
        List<VendorDto> pendingVendors = adminService.getPendingVendors()
                                                      .stream()
                                                      .map(v -> mapper.map(v, VendorDto.class))
                                                      .collect(Collectors.toList());
        return ResponseEntity.ok(pendingVendors);
    }
}
