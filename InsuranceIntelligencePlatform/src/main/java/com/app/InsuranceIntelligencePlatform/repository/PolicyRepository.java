package com.app.InsuranceIntelligencePlatform.repository;

import com.app.InsuranceIntelligencePlatform.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
}