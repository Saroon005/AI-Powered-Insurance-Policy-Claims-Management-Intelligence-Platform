package com.app.InsuranceIntelligencePlatform.entity;

import com.app.InsuranceIntelligencePlatform.enums.ProductStatus;
import com.app.InsuranceIntelligencePlatform.enums.ProductType;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "insurance_products")
public class InsuranceProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;

    @Enumerated(EnumType.STRING)
    private ProductType productType;

    private BigDecimal coverageAmount;

    private BigDecimal premiumRate;

    private Integer termMonths;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    public InsuranceProduct() {
    }

    public Long getId() {
        return id;
    }

    public String getProductName() {
        return productName;
    }

    public ProductType getProductType() {
        return productType;
    }

    public BigDecimal getCoverageAmount() {
        return coverageAmount;
    }

    public BigDecimal getPremiumRate() {
        return premiumRate;
    }

    public Integer getTermMonths() {
        return termMonths;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public void setCoverageAmount(BigDecimal coverageAmount) {
        this.coverageAmount = coverageAmount;
    }

    public void setPremiumRate(BigDecimal premiumRate) {
        this.premiumRate = premiumRate;
    }

    public void setTermMonths(Integer termMonths) {
        this.termMonths = termMonths;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }
}