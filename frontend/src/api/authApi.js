import { AUTH_API_URL } from "./apiConfig.js";
import { apiRequest } from "./apiClient.js";

export const registerUser = (userData) =>
  apiRequest(`${AUTH_API_URL}/register`, {
    method: "POST",
    body: userData,
    fallbackError: "Registration failed",
  });

export const loginUser = (email, password) =>
  apiRequest(`${AUTH_API_URL}/login`, {
    method: "POST",
    body: { email, password },
    fallbackError: "Login failed",
  });

export const forgotPassword = (email) =>
  apiRequest(`${AUTH_API_URL}/forgot-password`, {
    method: "POST",
    body: { email },
    fallbackError: "Unable to send OTP",
  });

export const verifyOtp = (email, otp) =>
  apiRequest(`${AUTH_API_URL}/verify-otp`, {
    method: "POST",
    body: { email, otp },
    fallbackError: "OTP verification failed",
  });

export const resetPassword = (email, otp, newPassword) =>
  apiRequest(`${AUTH_API_URL}/reset-password`, {
    method: "POST",
    body: { email, otp, new_password: newPassword },
    fallbackError: "Password reset failed",
  });
