package com.app.InsuranceIntelligencePlatform.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class FraudRequestDTO {

    @JsonProperty("claim_id")
    private Long claimId;

    @JsonProperty("claim_amount")
    private BigDecimal claimAmount;

    @JsonProperty("claim_type")
    private String claimType;

    @JsonProperty("days_since_policy_start")
    private Long daysSincePolicyStart;

    public Long getClaimId() {
        return claimId;
    }

    public BigDecimal getClaimAmount() {
        return claimAmount;
    }

    public String getClaimType() {
        return claimType;
    }

    public Long getDaysSincePolicyStart() {
        return daysSincePolicyStart;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public void setClaimAmount(BigDecimal claimAmount) {
        this.claimAmount = claimAmount;
    }

    public void setClaimType(String claimType) {
        this.claimType = claimType;
    }

    public void setDaysSincePolicyStart(Long daysSincePolicyStart) {
        this.daysSincePolicyStart = daysSincePolicyStart;
    }
}