package com.coursereg.controller;


import com.coursereg.dto.CourseRequest;
import com.coursereg.dto.LoginRequest;
import com.coursereg.model.Course;
import com.coursereg.model.StudentCourse;
import com.coursereg.repository.CourseRepository;
import com.coursereg.repository.StudentCourseRepository;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${admin.name}")
    private String adminName;

    @Value("${admin.password}")
    private String adminPassword;

   
    private final StudentCourseRepository studentCourseRepository;


    private final CourseRepository courseRepository;

    public AdminController(CourseRepository courseRepository,StudentCourseRepository studentCourseRepository) {
        this.courseRepository = courseRepository;
        this.studentCourseRepository=studentCourseRepository;
    }

    // POST /api/admin/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        if (adminName.equals(req.getName()) && adminPassword.equals(req.getPassword())) {
            return ResponseEntity.ok(Map.of("status", "success"));
        }
        return ResponseEntity.status(401).body(Map.of("status", "invalid credentials"));
    }

    // POST /api/admin/courses
    // body: { "courseName": "...", "durationDays": 30, "courseType": "..." }
    @PostMapping("/courses")
    public ResponseEntity<?> addCourse(@Valid @RequestBody CourseRequest req) {
        Course c = new Course();
        c.setCourseName(req.getCourseName());
        c.setDurationDays(req.getDurationDays());
        c.setCourseType(req.getCourseType());
        Course saved = courseRepository.save(c);
        return ResponseEntity.ok(Map.of("status", "course added", "courseId", saved.getCourseId()));
    }

    // DELETE /api/admin/courses/{courseName}
    @DeleteMapping("/courses/{courseName}")
    @Transactional 
    public ResponseEntity<?> removeCourse(@PathVariable String courseName) {
        try{
            courseRepository.deleteByCourseName(courseName);
            return ResponseEntity.ok(Map.of("status", "course removed"));
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Unable to remove course: " + e.getMessage()));
        }
    }


    // 1. Get all student enrollments with course names for Admin Dashboard
    @GetMapping("/enrollments")
    public ResponseEntity<?> getAllEnrollments() {
        List<StudentCourse> enrollments = studentCourseRepository.findAll();
        Map<Integer, String> courseNames = courseRepository.findAll().stream()
                .collect(Collectors.toMap(Course::getCourseId, Course::getCourseName));

        List<Map<String, Object>> result = enrollments.stream().map(e -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", e.getId()); // Primary key of StudentCourse
            map.put("studentName", e.getStudentName());
            map.put("courseId", e.getCourseId());
            map.put("courseName", courseNames.getOrDefault(e.getCourseId(), "Course #" + e.getCourseId()));
            map.put("status", e.getStatus() != null ? e.getStatus() : "PENDING");
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    // 2. Approve or Reject an enrollment
    @PutMapping("/enrollments/{id}/status")
    @Transactional
    public ResponseEntity<?> updateEnrollmentStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        return studentCourseRepository.findById(id).map(enrollment -> {
            enrollment.setStatus(status.toUpperCase()); // "APPROVED" or "REJECTED"
            studentCourseRepository.save(enrollment);
            return ResponseEntity.ok(Map.of("status", "Enrollment updated to " + status));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Enrollment not found")));
    }    


}
