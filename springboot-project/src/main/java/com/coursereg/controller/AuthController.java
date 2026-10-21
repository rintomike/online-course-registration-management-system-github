package com.coursereg.controller;

import com.coursereg.dto.ForgotPasswordRequest;
import com.coursereg.dto.LoginRequest;
import com.coursereg.dto.RegisterRequest;
import com.coursereg.dto.SignupRequest;
import com.coursereg.dto.UpdateProfileRequest;
import com.coursereg.model.Student;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Replaces user.login / user.register / user.forget_pass (console I/O -> JSON).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

 
    
}
