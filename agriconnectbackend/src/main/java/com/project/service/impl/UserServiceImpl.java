package com.project.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.dto.LoginRequestDto;
import com.project.dto.UserDto;
import com.project.entity.Admin;
import com.project.entity.Location;
import com.project.entity.User;
import com.project.entity.Vendor;
import com.project.enums.Role;
import com.project.exception.ConflictException;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.AdminRepository;
import com.project.repository.UserRepository;
import com.project.repository.VendorRepository;
import com.project.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ModelMapper modelMapper;

    // ==========================
    // USER Registration
    // ==========================
    @Override
    public UserDto createUser(UserDto dto) {
        validateEmailAndMobile(dto);

        User user = modelMapper.map(dto, User.class);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(dto.getPassword());
        user.setRole(Role.USER);

        userRepository.save(user);

        UserDto responseDto = modelMapper.map(user, UserDto.class);
        responseDto.setRoleName(user.getRole().name());
        return responseDto;
    }

    // ==========================
    // VENDOR Registration
    // ==========================
    @Override
    public UserDto createVendor(UserDto dto) {
        validateEmailAndMobile(dto);

        User user = modelMapper.map(dto, User.class);
        user.setCreatedAt(LocalDateTime.now());
        user.setPassword(dto.getPassword());
        user.setRole(Role.VENDOR);

        userRepository.save(user);

        Vendor vendor = new Vendor();
        vendor.setUser(user);
        vendor.setShopName(dto.getShopName());

        Location location = modelMapper.map(dto.getLocation(), Location.class);
        vendor.setLocation(location);

        vendorRepository.save(vendor);

        UserDto responseDto = modelMapper.map(user, UserDto.class);
        responseDto.setRoleName(user.getRole().name());
        return responseDto;
    }

    // ==========================
    // ADMIN Registration
    // ==========================
    @Override
    public UserDto createAdmin(UserDto dto) {
        validateEmailAndMobile(dto);

        Admin admin = new Admin();
        admin.setFirstName(dto.getFirstName());
        admin.setLastName(dto.getLastName());
        admin.setEmail(dto.getEmail());
        admin.setMobileNumber(dto.getMobileNumber());
        admin.setPassword(dto.getPassword());
        admin.setRole(Role.ADMIN);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        adminRepository.save(admin);

        UserDto responseDto = modelMapper.map(admin, UserDto.class);
        responseDto.setRoleName(admin.getRole().name());
        return responseDto;
    }

    // ==========================
    // Login
    // ==========================
    @Override
    public UserDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getPassword().trim().equals(request.getPassword().trim())) {
            throw new ConflictException("Invalid credentials");
        }

        UserDto dto = modelMapper.map(user, UserDto.class);
        dto.setRoleName(user.getRole().name());
        
        if (user.getRole() == Role.VENDOR) {
            Vendor vendor = vendorRepository.findById(user.getId())
            	    .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
            dto.setVendorId(vendor.getId());
        }

        return dto;
    }

    // ==========================
    // Read Operations
    // ==========================
    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserDto.class))
                .toList();
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return modelMapper.map(user, UserDto.class);
    }

    // ==========================
    // Update
    // ==========================
    @Override
    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new ConflictException("Email already exists");
            }
            user.setEmail(dto.getEmail());
        }

        if (dto.getMobileNumber() != null && !dto.getMobileNumber().equals(user.getMobileNumber())) {
            if (userRepository.existsByMobileNumber(dto.getMobileNumber())) {
                throw new ConflictException("Mobile number already exists");
            }
            user.setMobileNumber(dto.getMobileNumber());
        }

        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getPassword() != null) user.setPassword(dto.getPassword());

        userRepository.save(user);
        return modelMapper.map(user, UserDto.class);
    }

    // ==========================
    // Delete
    // ==========================
    @Override
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    // ==========================
    // Utility
    // ==========================
    private void validateEmailAndMobile(UserDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ConflictException("Email already exists");
        }
        if (userRepository.existsByMobileNumber(dto.getMobileNumber())) {
            throw new ConflictException("Mobile number already exists");
        }
    }
}