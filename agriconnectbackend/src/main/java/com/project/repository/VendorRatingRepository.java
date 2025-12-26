package com.project.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.entity.VendorRating;

@Repository
public interface VendorRatingRepository extends JpaRepository<VendorRating, Long> {
    List<VendorRating> findByVendorId(Long vendorId);
}