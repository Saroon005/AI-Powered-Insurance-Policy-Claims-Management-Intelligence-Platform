package com.app.InsuranceIntelligencePlatform.dto;

import com.app.InsuranceIntelligencePlatform.enums.PolicyStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PolicyRequestDTO {

    private Long customerId;
    private Long agentId;
    private Long productId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal premiumAmount;
    private PolicyStatus status;
    private Integer fraudRiskScore;

    public Long getCustomerId() {
        return customerId;
    }

    public Long getAgentId() {
        return agentId;
    }

    public Long getProductId() {
        return productId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public BigDecimal getPremiumAmount() {
        return premiumAmount;
    }

    public PolicyStatus getStatus() {
        return status;
    }

    public Integer getFraudRiskScore() {
        return fraudRiskScore;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setPremiumAmount(BigDecimal premiumAmount) {
        this.premiumAmount = premiumAmount;
    }

    public void setStatus(PolicyStatus status) {
        this.status = status;
    }

    public void setFraudRiskScore(Integer fraudRiskScore) {
        this.fraudRiskScore = fraudRiskScore;
    }
}