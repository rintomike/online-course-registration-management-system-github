package com.coursereg.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String password;


}
