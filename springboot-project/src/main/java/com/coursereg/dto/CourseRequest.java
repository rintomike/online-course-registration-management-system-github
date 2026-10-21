package com.coursereg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CourseRequest {
    @NotBlank
    private String courseName;

    @NotNull
    private Integer durationDays;

    @NotBlank
    private String courseType;
}
