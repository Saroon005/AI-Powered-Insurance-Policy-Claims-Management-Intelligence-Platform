package com.app.InsuranceIntelligencePlatform.entity;

import com.app.InsuranceIntelligencePlatform.enums.PolicyStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal premiumAmount;

    @Enumerated(EnumType.STRING)
    private PolicyStatus status;

    private Integer fraudRiskScore;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private InsuranceProduct product;

    public Policy() {
    }

    public Long getId() {
        return id;
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

    public Customer getCustomer() {
        return customer;
    }

    public Agent getAgent() {
        return agent;
    }

    public InsuranceProduct getProduct() {
        return product;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setAgent(Agent agent) {
        this.agent = agent;
    }

    public void setProduct(InsuranceProduct product) {
        this.product = product;
    }
}