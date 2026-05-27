package com.app.InsuranceIntelligencePlatform.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FraudResponseDTO {

    @JsonProperty("claim_id")
    private Long claimId;

    @JsonProperty("fraud_score")
    private Integer fraudScore;

    @JsonProperty("risk_level")
    private String riskLevel;

    private String action;

    public Long getClaimId() {
        return claimId;
    }

    public Integer getFraudScore() {
        return fraudScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public String getAction() {
        return action;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public void setFraudScore(Integer fraudScore) {
        this.fraudScore = fraudScore;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public void setAction(String action) {
        this.action = action;
    }
}