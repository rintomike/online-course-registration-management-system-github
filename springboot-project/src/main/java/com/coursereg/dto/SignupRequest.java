package com.coursereg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Matches the sign-up.html / scripts.js form exactly - only username and password.
 * Age, mobile number, and address are collected separately later (e.g. on a
 * "complete your profile" step) rather than at signup.
 */
public class SignupRequest {

    @NotBlank
    @Size(min = 3, message = "Username must contain at least 3 characters.")
    private String username;

    @NotBlank
    @Size(min = 6, message = "Password must contain at least 6 characters.")
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}