package com.app.InsuranceIntelligencePlatform.entity;

import com.app.InsuranceIntelligencePlatform.enums.ClaimStatus;
import com.app.InsuranceIntelligencePlatform.enums.ClaimType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ClaimType claimType;

    private LocalDate incidentDate;

    private BigDecimal claimAmount;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    private Integer fraudScore;

    private Long surveyorId;

    @ManyToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public Claim() {
    }

    public Long getId() {
        return id;
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

    public Policy getPolicy() {
        return policy;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setPolicy(Policy policy) {
        this.policy = policy;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}