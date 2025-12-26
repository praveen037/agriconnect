package com.project.service;

import java.util.List;

import com.project.dto.AdminDto;
import com.project.dto.VendorDto;
import com.project.entity.Vendor;

public interface AdminService {

	VendorDto approveVendor(Long id);
    VendorDto rejectVendor(Long id);
	List<Vendor> getPendingVendors();
	
    AdminDto registerAdmin(AdminDto dto);
    AdminDto loginAdmin(String email, String password);
	
//    Expert approveExpert(Long expertId);
//    Expert rejectExpert(Long expertId);
//    List<Expert> getPendingExperts();
}
