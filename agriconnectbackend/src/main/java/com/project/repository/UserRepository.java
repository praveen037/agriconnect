package com.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.entity.User;
import com.project.entity.Vendor;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find user by mobile number
    Optional<User> findByMobileNumber(String mobileNumber);
    
    // Optional: check existence directly
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);

    Optional<User> findByEmailIgnoreCase(String email);
}
