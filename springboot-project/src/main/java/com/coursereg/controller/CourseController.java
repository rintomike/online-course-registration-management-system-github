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
    private final CourseRepository courseRepository;
    private final StudentCourseRepository studentCourseRepository;

    public CourseController(CourseRepository courseRepository, StudentCourseRepository studentCourseRepository) {
        this.courseRepository = courseRepository;
        this.studentCourseRepository = studentCourseRepository;
    }

    // GET /api/courses  -> list all available courses
    @GetMapping
    public ResponseEntity<List<Course>> allCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    // POST /api/courses/register
    // body: { "studentName": "...", "courseId": 3 }
    @PostMapping("/register")
    public ResponseEntity<?> registerForCourse(@Valid @RequestBody CourseEnrollRequest req) {
        boolean courseExists = courseRepository.existsByCourseId(req.getCourseId());
        if (!courseExists) {
            return ResponseEntity.status(404).body(Map.of("status", "course not found"));
        }
        StudentCourse sc = new StudentCourse(req.getStudentName(), req.getCourseId());
        studentCourseRepository.save(sc);
        return ResponseEntity.ok(Map.of("status", "registration successful"));
    }

    
    @GetMapping("/student/{studentName}")
    public ResponseEntity<?> getEnrolledCourses(@PathVariable String studentName) {
        // 1. Find all enrollments for this student
        List<StudentCourse> enrollments = studentCourseRepository.findByStudentName(studentName);

        // 2. Extract the courseIds (as Integer) and return the matching Course objects
        List<Integer> courseIds = enrollments.stream()
                .map(StudentCourse::getCourseId)
                .toList();

        List<Course> enrolledCourses = courseRepository.findAllById(courseIds);
        return ResponseEntity.ok(enrolledCourses);
    }

}
