package com.coursereg.repository;

import com.coursereg.model.StudentCourse;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentCourseRepository extends JpaRepository<StudentCourse, Integer> {
    boolean existsByStudentName(String studentName);
    List<StudentCourse> findByStudentName(String studentName);
}
