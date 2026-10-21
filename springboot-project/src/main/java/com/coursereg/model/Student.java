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

    public Student() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
