package com.coursereg.dto;

public class UpdateProfileRequest {
    private Integer age;
    private String mobileNo;
    private String address;

    public UpdateProfileRequest() {}
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getMobileNo() { return mobileNo; }
    public void setMobileNo(String mobileNo) { this.mobileNo = mobileNo; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}