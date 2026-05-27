package com.app.InsuranceIntelligencePlatform.repository;

import com.app.InsuranceIntelligencePlatform.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
}