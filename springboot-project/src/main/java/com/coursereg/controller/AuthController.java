package com.coursereg.controller;

import com.coursereg.dto.ForgotPasswordRequest;
import com.coursereg.dto.LoginRequest;
import com.coursereg.dto.RegisterRequest;
import com.coursereg.dto.SignupRequest;
import com.coursereg.dto.UpdateProfileRequest;
import com.coursereg.model.Student;
import com.coursereg.repository.StudentRepository;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Replaces user.login / user.register / user.forget_pass (console I/O -> JSON).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StudentRepository studentRepository;

    public AuthController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // POST /api/auth/register
    // body: { "name": "...", "age": 21, "mobileNo": "9876543210", "address": "...", "password": "..." }
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        Student s = new Student();
        s.setName(req.getName());
        s.setAge(req.getAge());
        s.setMobileNo(req.getMobileNo());
        s.setAddress(req.getAddress());
        s.setPassword(req.getPassword());
        Student saved = studentRepository.save(s);
        return ResponseEntity.ok(Map.of("status", "registered", "studentId", saved.getId()));
    }

    // POST /api/auth/signup
    // body: { "username": "...", "password": "..." }
    // Matches sign-up.html / scripts.js exactly. Age/mobileNo/address are left
    // null here and can be filled in later via a profile-completion step.
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        if (studentRepository.existsByName(req.getUsername())) {
            return ResponseEntity.status(409).body(Map.of("message", "That username is already taken."));
        }
        Student s = new Student();
        s.setName(req.getUsername());
        s.setPassword(req.getPassword());
        Student saved = studentRepository.save(s);
        return ResponseEntity.ok(Map.of("status", "registered", "studentId", saved.getId()));
    }

    // POST /api/auth/login
    // body: { "name": "...", "password": "..." }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Optional<Student> student = studentRepository.findByNameAndPassword(req.getName(), req.getPassword());
        if (student.isPresent()) {
            return ResponseEntity.ok(Map.of("status", "success", "name", student.get().getName()));
        }
        return ResponseEntity.status(401).body(Map.of("status", "invalid credentials"));
    } 

    // POST /api/auth/forgot-password
    // body: { "name": "...", "mobileNo": "...", "newPassword": "..." }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        Optional<Student> student = studentRepository.findByNameAndMobileNo(req.getName(), req.getMobileNo());
        if (student.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("status", "no matching record"));
        }
        Student s = student.get();
        s.setPassword(req.getNewPassword());
        studentRepository.save(s);
        return ResponseEntity.ok(Map.of("status", "password updated"));
    }    


    // GET /api/auth/profile/{name} (new one)
    @GetMapping("/profile/{name}")
    public ResponseEntity<?> profile(@PathVariable String name) {
        return studentRepository.findAll().stream()
                .filter(s -> s.getName().equals(name))
                .findFirst()
                .<ResponseEntity<?>>map(s -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("name", s.getName());
                    response.put("age", s.getAge());
                    response.put("mobileNo", s.getMobileNo());
                    response.put("address", s.getAddress());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("status", "not found")));
    }

    //PUT /api/auth/profile/{name} endpoint
    @PutMapping("/profile/{name}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String name,
            @RequestBody UpdateProfileRequest request) {

        Optional<Student> optionalStudent = studentRepository.findByName(name);

        if (optionalStudent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Student student = optionalStudent.get();
        student.setAge(request.getAge());
        student.setMobileNo(request.getMobileNo());
        student.setAddress(request.getAddress());
        studentRepository.save(student);

        return ResponseEntity.ok(
            Map.of("message", "Profile updated successfully")
        );
    }    
    
}
