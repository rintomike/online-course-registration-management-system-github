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
    
}
