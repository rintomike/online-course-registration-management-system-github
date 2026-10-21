package com.coursereg.repository;

import com.coursereg.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    // Replaces: SELECT * FROM allinfo WHERE sname = ? AND spass = ?
    Optional<Student> findByNameAndPassword(String name, String password);

    // Replaces: SELECT * FROM allinfo WHERE sname = ? AND snumber = ?  (used by forgot-password)
    Optional<Student> findByNameAndMobileNo(String name, String mobileNo);

    Optional<Student> findByName(String name);

    boolean existsByName(String name);
}

