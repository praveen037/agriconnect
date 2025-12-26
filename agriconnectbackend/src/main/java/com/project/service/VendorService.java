package com.project.service;

import java.util.List;

import com.project.dto.VendorDto;
import com.project.entity.Vendor;
import com.project.enums.ApprovalStatus;

public interface VendorService {

    VendorDto registerVendor(VendorDto dto);

    VendorDto loginVendor(String email, String password); // login method

    List<VendorDto> getAllVendors();

    VendorDto getVendorById(Long id);

    VendorDto updateVendor(Long id, VendorDto dto);

    void deleteVendor(Long id);

    List<Vendor> findVendorsByLocation(String state, String district, String village);

    VendorDto updateVendorStatus(Long id, ApprovalStatus status);

    // ✅ New method for rating submission
    void submitRating(Long vendorId, Long orderId, int rating, Long userId);
}