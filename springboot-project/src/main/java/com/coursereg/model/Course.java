package com.coursereg.model;

import jakarta.persistence.*;

/**
 * Maps to the existing "allcourse" table used by Student_options.show_courses / admin.add_course.
 */
@Entity
@Table(name = "allcourse")
public class Course {

    @Id
    @Column(name = "course_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer courseId;

    @Column(name = "coursename")
    private String courseName;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "coursetype")
    private String courseType;

}
