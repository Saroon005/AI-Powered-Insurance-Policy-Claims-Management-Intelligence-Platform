package com.app.InsuranceIntelligencePlatform.dto;

import com.app.InsuranceIntelligencePlatform.enums.AgentStatus;

import java.math.BigDecimal;

public class AgentResponseDTO {

    private Long id;
    private String licenseNo;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String region;
    private BigDecimal commissionPct;
    private AgentStatus status;

    public AgentResponseDTO() {
    }

    public AgentResponseDTO(Long id,
                            String licenseNo,
                            String firstName,
                            String lastName,
                            String email,
                            String phoneNumber,
                            String region,
                            BigDecimal commissionPct,
                            AgentStatus status) {

        this.id = id;
        this.licenseNo = licenseNo;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.region = region;
        this.commissionPct = commissionPct;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getLicenseNo() {
        return licenseNo;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getRegion() {
        return region;
    }

    public BigDecimal getCommissionPct() {
        return commissionPct;
    }

    public AgentStatus getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLicenseNo(String licenseNo) {
        this.licenseNo = licenseNo;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public void setCommissionPct(BigDecimal commissionPct) {
        this.commissionPct = commissionPct;
    }

    public void setStatus(AgentStatus status) {
        this.status = status;
    }
}