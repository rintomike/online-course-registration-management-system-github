package com.coursereg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {
    @NotBlank
    private String name;

    @NotNull
    private Integer age;

    @NotBlank
    private String mobileNo;

    @NotBlank
    private String address;

    @NotBlank
    private String password;


}
