package com.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.LoginRequestDto;
import com.project.dto.VendorDto;
import com.project.enums.ApprovalStatus;
import com.project.service.VendorService;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "http://localhost:3000")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @PostMapping("/register")
    public ResponseEntity<VendorDto> registerVendor(@RequestBody VendorDto dto) {
        return ResponseEntity.ok(vendorService.registerVendor(dto));
    }

    @PostMapping("/vendor-login")
    public ResponseEntity<?> loginVendor(@RequestBody LoginRequestDto request) {
        System.out.println("Vendor login attempt: " + request.getEmail());
        VendorDto vendor = vendorService.loginVendor(request.getEmail(), request.getPassword());

        if (vendor == null) {
            return ResponseEntity.status(400).body("Invalid credentials or not approved yet.");
        }

        System.out.println("Vendor returned: " + vendor);
        return ResponseEntity.ok(vendor);
    }

    @GetMapping
    public ResponseEntity<List<VendorDto>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    // Get vendor by numeric ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<VendorDto> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    // Update vendor
    @PutMapping("/{id:\\d+}")
    public ResponseEntity<VendorDto> updateVendor(@PathVariable Long id, @RequestBody VendorDto dto) {
        return ResponseEntity.ok(vendorService.updateVendor(id, dto));
    }

    // Delete vendor
    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<String> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok("Vendor deleted successfully");
    }

    // Approve vendor
    @PutMapping("/{id:\\d+}/approve")
    public ResponseEntity<VendorDto> approveVendor(@PathVariable Long id) {
        VendorDto updatedVendor = vendorService.updateVendorStatus(id, ApprovalStatus.APPROVED);
        return ResponseEntity.ok(updatedVendor);
    }

    // Reject vendor
    @PutMapping("/{id:\\d+}/reject")
    public ResponseEntity<VendorDto> rejectVendor(@PathVariable Long id) {
        VendorDto updatedVendor = vendorService.updateVendorStatus(id, ApprovalStatus.REJECTED);
        return ResponseEntity.ok(updatedVendor);
    }
}
