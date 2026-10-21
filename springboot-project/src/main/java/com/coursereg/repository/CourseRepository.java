package com.coursereg.repository;

import com.coursereg.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;



public interface CourseRepository extends JpaRepository<Course, Integer> {


}
