package com.app.InsuranceIntelligencePlatform.dto;

import com.app.InsuranceIntelligencePlatform.enums.ClaimStatus;
import com.app.InsuranceIntelligencePlatform.enums.ClaimType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ClaimResponseDTO {

    private Long id;
    private Long policyId;
    private String customerName;
    private ClaimType claimType;
    private LocalDate incidentDate;
    private BigDecimal claimAmount;
    private ClaimStatus status;
    private Integer fraudScore;
    private Long surveyorId;

    public Long getId() {
        return id;
    }

    public Long getPolicyId() {
        return policyId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public ClaimType getClaimType() {
        return claimType;
    }

    public LocalDate getIncidentDate() {
        return incidentDate;
    }

    public BigDecimal getClaimAmount() {
        return claimAmount;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public Integer getFraudScore() {
        return fraudScore;
    }

    public Long getSurveyorId() {
        return surveyorId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setClaimType(ClaimType claimType) {
        this.claimType = claimType;
    }

    public void setIncidentDate(LocalDate incidentDate) {
        this.incidentDate = incidentDate;
    }

    public void setClaimAmount(BigDecimal claimAmount) {
        this.claimAmount = claimAmount;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public void setFraudScore(Integer fraudScore) {
        this.fraudScore = fraudScore;
    }

    public void setSurveyorId(Long surveyorId) {
        this.surveyorId = surveyorId;
    }
}