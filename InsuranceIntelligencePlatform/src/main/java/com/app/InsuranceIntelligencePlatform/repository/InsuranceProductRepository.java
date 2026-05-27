package com.app.InsuranceIntelligencePlatform.repository;

import com.app.InsuranceIntelligencePlatform.entity.InsuranceProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsuranceProductRepository extends JpaRepository<InsuranceProduct, Long> {
}