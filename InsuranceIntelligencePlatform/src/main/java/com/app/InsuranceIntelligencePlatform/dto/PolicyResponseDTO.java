package com.app.InsuranceIntelligencePlatform.dto;

import com.app.InsuranceIntelligencePlatform.enums.PolicyStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PolicyResponseDTO {

    private Long id;
    private String customerName;
    private String agentName;
    private String productName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal premiumAmount;
    private PolicyStatus status;
    private Integer fraudRiskScore;

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getAgentName() {
        return agentName;
    }

    public String getProductName() {
        return productName;
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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