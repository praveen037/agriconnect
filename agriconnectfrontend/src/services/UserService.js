// src/services/UserService.js
import api from "./api";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/users/login", {
      email: email,
      password: password,
    });
    return response.data; // This is your UserDto
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};
