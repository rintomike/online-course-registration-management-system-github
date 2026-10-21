package com.coursereg.repository;

import com.coursereg.model.Course;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



public interface CourseRepository extends JpaRepository<Course, Integer> {
    // Replaces: delete from allcourse where coursename = ?
    long deleteByCourseName(String courseName);

    boolean existsByCourseId(Integer courseId);

    Optional<Course> findByCourseName(String courseName);

}
