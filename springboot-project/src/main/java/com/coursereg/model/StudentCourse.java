package com.coursereg.model;

import jakarta.persistence.*;

/**
 * Maps to the existing "student_courses" table used by Student_options.register_course.
 */
@Entity
@Table(name = "student_courses")
public class StudentCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sname")
    private String studentName;

    @Column(name = "course_id")
    private Integer courseId;

    public StudentCourse() {}

    public StudentCourse(String studentName, Integer courseId) {
        this.studentName = studentName;
        this.courseId = courseId;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }
}
