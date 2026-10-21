package com.coursereg.controller;

import com.coursereg.dto.CourseEnrollRequest;
import com.coursereg.model.Course;
import com.coursereg.model.StudentCourse;
import com.coursereg.repository.CourseRepository;
import com.coursereg.repository.StudentCourseRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Replaces Student_options.show_courses / Student_options.register_course.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {


}
