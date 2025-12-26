package com.project.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.dto.LocationDto;
import com.project.dto.VendorDto;
import com.project.entity.Location;
import com.project.entity.Order;
import com.project.entity.User;
import com.project.entity.Vendor;
import com.project.entity.VendorRating;
import com.project.enums.ApprovalStatus;
import com.project.enums.Role;
import com.project.exception.ConflictException;
import com.project.exception.ResourceNotFoundException;
import com.project.repository.LocationRepository;
import com.project.repository.OrderRepository;
import com.project.repository.UserRepository;
import com.project.repository.VendorRatingRepository;
import com.project.repository.VendorRepository;
import com.project.service.VendorService;

@Service
public class VendorServiceImpl implements VendorService {

    @Autowired private VendorRepository vendorRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private LocationRepository locationRepository;
    @Autowired private VendorRatingRepository vendorRatingRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ModelMapper mapper;

    @Override
    public VendorDto registerVendor(VendorDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent())
            throw new ConflictException("Email already exists");
        if (userRepository.findByMobileNumber(dto.getMobileNumber()).isPresent())
            throw new ConflictException("Mobile number already exists");

        // ✅ Create User
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setMobileNumber(dto.getMobileNumber());
        user.setPassword(dto.getPassword());
        user.setRole(Role.VENDOR);
        user.setApprovalStatus(ApprovalStatus.PENDING);
        user.setCreatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        // ✅ Resolve Location
        Location location = null;
        if (dto.getLocation() != null) {
            Optional<Location> existingLocation = locationRepository
                .findByStateAndDistrictAndSubLocationAndZipCode(
                    dto.getLocation().getState(),
                    dto.getLocation().getDistrict(),
                    dto.getLocation().getSubLocation(),
                    dto.getLocation().getZipCode()
                );
            location = existingLocation.orElseGet(
                () -> locationRepository.save(mapper.map(dto.getLocation(), Location.class))
            );
        }

        // ✅ Create Vendor using same ID
        Vendor vendor = new Vendor();
        vendor.setUser(savedUser); // sets vendor.id = user.id
        vendor.setFirstName(savedUser.getFirstName());
        vendor.setLastName(savedUser.getLastName());
        vendor.setEmail(savedUser.getEmail());
        vendor.setMobileNumber(savedUser.getMobileNumber());
        vendor.setShopName(dto.getShopName());
        vendor.setAddress(dto.getAddress());
        vendor.setRole(Role.VENDOR);
        vendor.setStatus(ApprovalStatus.PENDING);
        vendor.setLocation(location);
        vendor.setCreatedAt(LocalDateTime.now());

        Vendor savedVendor = vendorRepository.save(vendor);

        VendorDto vendorDto = mapper.map(savedVendor, VendorDto.class);
        vendorDto.setRole(savedVendor.getRole().name());
        vendorDto.setStatus(savedVendor.getStatus());
        return vendorDto;
    }

    @Override
    public VendorDto loginVendor(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        if (!user.getPassword().equals(password))
            throw new ConflictException("Invalid credentials");

        if (user.getRole() != Role.VENDOR)
            throw new ConflictException("Not a vendor account");

        Vendor vendor = vendorRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor info not found"));

        if (vendor.getStatus() == ApprovalStatus.PENDING)
            throw new ConflictException("Vendor account is pending approval");
        if (vendor.getStatus() == ApprovalStatus.REJECTED)
            throw new ConflictException("Vendor account has been rejected");

        VendorDto dto = mapper.map(vendor, VendorDto.class);
        dto.setRole(user.getRole().name());
        dto.setStatus(vendor.getStatus());
        if (vendor.getLocation() != null)
            dto.setLocation(mapper.map(vendor.getLocation(), LocationDto.class));

        return dto;
    }

    @Override
    public VendorDto updateVendorStatus(Long id, ApprovalStatus status) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        vendor.setStatus(status);
        vendor.setUpdatedAt(LocalDateTime.now());
        Vendor savedVendor = vendorRepository.save(vendor);

        VendorDto dto = mapper.map(savedVendor, VendorDto.class);
        dto.setRole(savedVendor.getRole().name());
        dto.setStatus(savedVendor.getStatus());
        return dto;
    }

    @Override
    public List<VendorDto> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(v -> {
                    VendorDto dto = mapper.map(v, VendorDto.class);
                    dto.setRole(v.getRole().name());
                    dto.setStatus(v.getStatus());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public VendorDto getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        VendorDto dto = mapper.map(vendor, VendorDto.class);
        dto.setRole(vendor.getRole().name());
        dto.setStatus(vendor.getStatus());
        return dto;
    }

    @Override
    public VendorDto updateVendor(Long id, VendorDto dto) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        if(dto.getFirstName() != null) vendor.setFirstName(dto.getFirstName());
        if(dto.getLastName() != null) vendor.setLastName(dto.getLastName());
        if(dto.getEmail() != null) vendor.setEmail(dto.getEmail());
        if(dto.getMobileNumber() != null) vendor.setMobileNumber(dto.getMobileNumber());
        if(dto.getShopName() != null) vendor.setShopName(dto.getShopName());
        if(dto.getAddress() != null) vendor.setAddress(dto.getAddress());

        vendor.setUpdatedAt(LocalDateTime.now());
        Vendor savedVendor = vendorRepository.save(vendor);

        VendorDto vendorDto = mapper.map(savedVendor, VendorDto.class);
        vendorDto.setRole(savedVendor.getRole().name());
        vendorDto.setStatus(savedVendor.getStatus());
        return vendorDto;
    }

    @Override
    public void deleteVendor(Long id) {
        if(!vendorRepository.existsById(id))
            throw new ResourceNotFoundException("Vendor not found");
        vendorRepository.deleteById(id);
    }

    @Override
    public List<Vendor> findVendorsByLocation(String state, String district, String village) {
        return vendorRepository.findByLocation_StateAndLocation_DistrictAndLocation_SubLocation(state, district, village);
    }

    @Override
    public void submitRating(Long vendorId, Long orderId, int rating, Long userId) {
        Vendor vendor = vendorRepository.findById(vendorId)
            .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        VendorRating vr = new VendorRating();
        vr.setVendor(vendor);
        vr.setOrder(order);
        vr.setRating(rating);
        vr.setUserId(userId);

        vendorRatingRepository.save(vr);

        List<VendorRating> ratings = vendorRatingRepository.findByVendorId(vendorId);
        double avg = ratings.stream().mapToInt(VendorRating::getRating).average().orElse(0);
        vendor.setAverageRating(avg);
        vendor.setRatingCount(ratings.size());

        vendorRepository.save(vendor);
    }
}