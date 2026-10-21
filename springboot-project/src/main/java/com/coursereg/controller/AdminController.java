package com.coursereg.controller;


import com.coursereg.dto.CourseRequest;
import com.coursereg.dto.LoginRequest;
import com.coursereg.model.Course;
import com.coursereg.repository.CourseRepository;

import jakarta.validation.Valid;

import java.util.Map;

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

    private final CourseRepository courseRepository;

    public AdminController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
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


}
