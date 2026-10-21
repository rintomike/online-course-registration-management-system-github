package com.coursereg.controller;


import com.coursereg.repository.CourseRepository;


import org.springframework.beans.factory.annotation.Value;
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




}
