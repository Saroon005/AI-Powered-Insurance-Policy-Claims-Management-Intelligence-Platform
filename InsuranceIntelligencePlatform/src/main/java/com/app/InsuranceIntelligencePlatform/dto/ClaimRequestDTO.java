package com.app.InsuranceIntelligencePlatform.dto;

import com.app.InsuranceIntelligencePlatform.enums.ClaimType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ClaimRequestDTO {

    private Long policyId;
    private ClaimType claimType;
    private LocalDate incidentDate;
    private BigDecimal claimAmount;
    private Long surveyorId;

    public Long getPolicyId() {
        return policyId;
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

    public Long getSurveyorId() {
        return surveyorId;
    }

    public void setPolicyId(Long policyId) {
        this.policyId = policyId;
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

    public void setSurveyorId(Long surveyorId) {
        this.surveyorId = surveyorId;
    }
}