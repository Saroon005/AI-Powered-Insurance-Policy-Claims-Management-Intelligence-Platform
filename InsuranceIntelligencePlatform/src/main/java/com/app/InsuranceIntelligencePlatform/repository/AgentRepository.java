package com.app.InsuranceIntelligencePlatform.repository;

import com.app.InsuranceIntelligencePlatform.entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, Long> {
}