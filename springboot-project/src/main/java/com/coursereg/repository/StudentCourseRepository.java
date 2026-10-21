package com.coursereg.repository;

import com.coursereg.model.StudentCourse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentCourseRepository extends JpaRepository<StudentCourse, Integer> {
    boolean existsByStudentName(String studentName);
}
