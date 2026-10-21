package com.coursereg.model;

import jakarta.persistence.*;

/**
 * Maps to the existing "allinfo" table used by user.register / user.login.
 * Columns match exactly what the original CLI app inserted: sname, sage, snumber, sadd, spass.
 */
@Entity
@Table(name = "allinfo")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sname")
    private String name;

    @Column(name = "sage")
    private Integer age;

    @Column(name = "snumber")
    private String mobileNo;

    @Column(name = "sadd")
    private String address;

    @Column(name = "spass")
    private String password;


}
