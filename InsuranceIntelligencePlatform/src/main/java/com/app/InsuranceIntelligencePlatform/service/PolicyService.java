package com.app.InsuranceIntelligencePlatform.service;

import com.app.InsuranceIntelligencePlatform.dto.PolicyRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.PolicyResponseDTO;
import com.app.InsuranceIntelligencePlatform.entity.Agent;
import com.app.InsuranceIntelligencePlatform.entity.Customer;
import com.app.InsuranceIntelligencePlatform.entity.InsuranceProduct;
import com.app.InsuranceIntelligencePlatform.entity.Policy;
import com.app.InsuranceIntelligencePlatform.repository.AgentRepository;
import com.app.InsuranceIntelligencePlatform.repository.CustomerRepository;
import com.app.InsuranceIntelligencePlatform.repository.InsuranceProductRepository;
import com.app.InsuranceIntelligencePlatform.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;
    private final InsuranceProductRepository productRepository;

    public PolicyService(PolicyRepository policyRepository,
                         CustomerRepository customerRepository,
                         AgentRepository agentRepository,
                         InsuranceProductRepository productRepository) {
        this.policyRepository = policyRepository;
        this.customerRepository = customerRepository;
        this.agentRepository = agentRepository;
        this.productRepository = productRepository;
    }

    public PolicyResponseDTO createPolicy(PolicyRequestDTO requestDTO) {

        Customer customer = customerRepository.findById(requestDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Agent agent = agentRepository.findById(requestDTO.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        InsuranceProduct product = productRepository.findById(requestDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Insurance product not found"));

        Policy policy = new Policy();
        policy.setCustomer(customer);
        policy.setAgent(agent);
        policy.setProduct(product);
        policy.setStartDate(requestDTO.getStartDate());
        policy.setEndDate(requestDTO.getEndDate());
        policy.setPremiumAmount(requestDTO.getPremiumAmount());
        policy.setStatus(requestDTO.getStatus());
        policy.setFraudRiskScore(requestDTO.getFraudRiskScore());

        Policy savedPolicy = policyRepository.save(policy);

        return mapToResponseDTO(savedPolicy);
    }

    public List<PolicyResponseDTO> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public PolicyResponseDTO getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        return mapToResponseDTO(policy);
    }

    public PolicyResponseDTO updatePolicy(Long id, PolicyRequestDTO requestDTO) {

        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        Customer customer = customerRepository.findById(requestDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Agent agent = agentRepository.findById(requestDTO.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        InsuranceProduct product = productRepository.findById(requestDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Insurance product not found"));

        policy.setCustomer(customer);
        policy.setAgent(agent);
        policy.setProduct(product);
        policy.setStartDate(requestDTO.getStartDate());
        policy.setEndDate(requestDTO.getEndDate());
        policy.setPremiumAmount(requestDTO.getPremiumAmount());
        policy.setStatus(requestDTO.getStatus());
        policy.setFraudRiskScore(requestDTO.getFraudRiskScore());

        Policy updatedPolicy = policyRepository.save(policy);

        return mapToResponseDTO(updatedPolicy);
    }

    public void deletePolicy(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        policyRepository.delete(policy);
    }

    private PolicyResponseDTO mapToResponseDTO(Policy policy) {

        PolicyResponseDTO responseDTO = new PolicyResponseDTO();

        responseDTO.setId(policy.getId());
        responseDTO.setCustomerName(
                policy.getCustomer().getFirstName() + " " + policy.getCustomer().getLastName()
        );
        responseDTO.setAgentName(
                policy.getAgent().getFirstName() + " " + policy.getAgent().getLastName()
        );
        responseDTO.setProductName(policy.getProduct().getProductName());
        responseDTO.setStartDate(policy.getStartDate());
        responseDTO.setEndDate(policy.getEndDate());
        responseDTO.setPremiumAmount(policy.getPremiumAmount());
        responseDTO.setStatus(policy.getStatus());
        responseDTO.setFraudRiskScore(policy.getFraudRiskScore());

        return responseDTO;
    }
}