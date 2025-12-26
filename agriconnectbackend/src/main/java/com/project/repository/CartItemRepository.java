package com.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,Long> {

}
