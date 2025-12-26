// src/api/otpApi.js
import api from "./api"; // Axios instance

// Send OTP
export const sendOtp = (email) => api.post("/otp/send-otp", { email });

// Verify OTP
export const verifyOtp = (email, otp) => api.post("/otp/verify-otp", { email, otp });
