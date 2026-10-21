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

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Integer getDurationDays() { return durationDays; }
    public vod setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public String getCourseType() { return courseType; }
    public void setCourseType(String courseType) { this.courseType = courseType; }
}