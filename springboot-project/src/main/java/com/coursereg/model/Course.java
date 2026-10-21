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

    public Course() {}

    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public String getCourseType() { return courseType; }
    public void setCourseType(String courseType) { this.courseType = courseType; }
}
