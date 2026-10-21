package com.coursereg.dto;

import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String mobileNo;

    @NotBlank
    private String newPassword;


}
