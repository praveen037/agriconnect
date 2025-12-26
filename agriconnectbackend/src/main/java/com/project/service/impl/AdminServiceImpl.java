package com.project.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.dto.AdminDto;
import com.project.dto.VendorDto;
import com.project.entity.Admin;
import com.project.entity.User;
import com.project.entity.Vendor;
import com.project.enums.ApprovalStatus;
import com.project.enums.Role;
import com.project.exception.ConflictException;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AdminRepository;
import com.project.repository.UserRepository;
import com.project.repository.VendorRepository;
import com.project.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired private AdminRepository adminRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private VendorRepository vendorRepository;
    @Autowired private ModelMapper mapper;

    @Override
    public AdminDto registerAdmin(AdminDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ConflictException("Email already registered");
        }

        // ✅ Create User first
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setMobileNumber(dto.getMobileNumber());
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(Role.ADMIN);
        User savedUser = userRepository.save(user);

        // ✅ Create Admin using same ID
        Admin admin = new Admin();
        admin.setUser(savedUser); // sets admin.id = user.id
        admin.setFirstName(savedUser.getFirstName());
        admin.setLastName(savedUser.getLastName());
        admin.setEmail(savedUser.getEmail());
        admin.setPassword(savedUser.getPassword());
        admin.setMobileNumber(savedUser.getMobileNumber());
        admin.setCreatedAt(LocalDateTime.now());
        admin.setRole(Role.ADMIN);

        Admin savedAdmin = adminRepository.save(admin);
        return mapper.map(savedAdmin, AdminDto.class);
    }

    @Override
    public AdminDto loginAdmin(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (!user.getPassword().equals(password)) {
            throw new ConflictException("Invalid password");
        }

        if (user.getRole() != Role.ADMIN) {
            throw new ConflictException("Not an admin account");
        }

        Admin admin = adminRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin info not found"));

        return mapper.map(admin, AdminDto.class);
    }

    @Override
    public VendorDto approveVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        vendor.setStatus(ApprovalStatus.APPROVED);
        vendor.setUpdatedAt(LocalDateTime.now());
        Vendor savedVendor = vendorRepository.save(vendor);

        VendorDto dto = mapper.map(savedVendor, VendorDto.class);
        dto.setRole(savedVendor.getRole().name());
        dto.setStatus(savedVendor.getStatus());
        return dto;
    }

    @Override
    public VendorDto rejectVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        vendor.setStatus(ApprovalStatus.REJECTED);
        vendor.setUpdatedAt(LocalDateTime.now());
        Vendor savedVendor = vendorRepository.save(vendor);

        VendorDto dto = mapper.map(savedVendor, VendorDto.class);
        dto.setRole(savedVendor.getRole().name());
        dto.setStatus(savedVendor.getStatus());
        return dto;
    }

    @Override
    public List<Vendor> getPendingVendors() {
        return vendorRepository.findByStatus(ApprovalStatus.PENDING);
    }

    // ✅ Optional: If you want to return DTOs instead
    /*
    @Override
    public List<VendorDto> getPendingVendorDtos() {
        return vendorRepository.findByStatus(ApprovalStatus.PENDING).stream()
            .map(v -> {
                VendorDto dto = mapper.map(v, VendorDto.class);
                dto.setRole(v.getRole().name());
                dto.setStatus(v.getStatus());
                return dto;
            })
            .collect(Collectors.toList());
    }
    */
}