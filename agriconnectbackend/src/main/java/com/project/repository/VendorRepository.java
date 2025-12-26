package com.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Vendor;
import com.project.enums.ApprovalStatus;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    // Find vendor by user ID
    Optional<Vendor> findByUser_Id(Long userId);
    // Find vendors by approval status
    List<Vendor> findByStatus(ApprovalStatus status);

    // Find vendors by Location
    List<Vendor> findByLocation_StateAndLocation_DistrictAndLocation_SubLocation(
        String state, String district, String subLocation);
}
