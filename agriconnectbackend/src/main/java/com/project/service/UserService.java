package com.project.service;

import java.util.List;

import com.project.dto.LoginRequestDto;
import com.project.dto.UserDto;

public interface UserService {

    // Registration methods for each role
    UserDto createUser(UserDto dto);
    UserDto createVendor(UserDto dto);
    UserDto createAdmin(UserDto dto);

    // Login
    UserDto login(LoginRequestDto request);

    // CRUD operations
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto updateUser(Long id, UserDto dto);
    void deleteUserById(Long id);
}