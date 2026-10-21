package com.coursereg.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CourseEnrollRequest {
    @NotBlank
    private String studentName;

    @NotNull
    private Integer courseId;

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.coursId = courseId; }
}