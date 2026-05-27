package com.app.InsuranceIntelligencePlatform.dto;

import com.app.InsuranceIntelligencePlatform.enums.ProductStatus;
import com.app.InsuranceIntelligencePlatform.enums.ProductType;

import java.math.BigDecimal;

public class InsuranceProductRequestDTO {

    private String productName;
    private ProductType productType;
    private BigDecimal coverageAmount;
    private BigDecimal premiumRate;
    private Integer termMonths;
    private ProductStatus status;

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