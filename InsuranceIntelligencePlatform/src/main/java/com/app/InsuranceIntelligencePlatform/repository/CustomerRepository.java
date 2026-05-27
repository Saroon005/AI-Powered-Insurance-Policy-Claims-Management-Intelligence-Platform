package com.app.InsuranceIntelligencePlatform.repository;

import com.app.InsuranceIntelligencePlatform.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}