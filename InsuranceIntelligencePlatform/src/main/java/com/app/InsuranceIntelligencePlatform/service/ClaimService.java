package com.app.InsuranceIntelligencePlatform.service;

import com.app.InsuranceIntelligencePlatform.dto.ClaimRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.ClaimResponseDTO;
import com.app.InsuranceIntelligencePlatform.entity.Claim;
import com.app.InsuranceIntelligencePlatform.entity.Customer;
import com.app.InsuranceIntelligencePlatform.entity.Policy;
import com.app.InsuranceIntelligencePlatform.enums.ClaimStatus;
import com.app.InsuranceIntelligencePlatform.repository.ClaimRepository;
import com.app.InsuranceIntelligencePlatform.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;

    public ClaimService(ClaimRepository claimRepository,
                        PolicyRepository policyRepository) {
        this.claimRepository = claimRepository;
        this.policyRepository = policyRepository;
    }

    public ClaimResponseDTO createClaim(ClaimRequestDTO requestDTO) {

        Policy policy = policyRepository.findById(requestDTO.getPolicyId())
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        Customer customer = policy.getCustomer();

        Claim claim = new Claim();

        claim.setPolicy(policy);
        claim.setCustomer(customer);
        claim.setClaimType(requestDTO.getClaimType());
        claim.setIncidentDate(requestDTO.getIncidentDate());
        claim.setClaimAmount(requestDTO.getClaimAmount());
        claim.setSurveyorId(requestDTO.getSurveyorId());
        claim.setStatus(ClaimStatus.SUBMITTED);
        claim.setFraudScore(0);

        Claim savedClaim = claimRepository.save(claim);

        return mapToResponseDTO(savedClaim);
    }

    public List<ClaimResponseDTO> getAllClaims() {

        return claimRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public ClaimResponseDTO getClaimById(Long id) {

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        return mapToResponseDTO(claim);
    }

    public void deleteClaim(Long id) {

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claimRepository.delete(claim);
    }

    private ClaimResponseDTO mapToResponseDTO(Claim claim) {

        ClaimResponseDTO responseDTO = new ClaimResponseDTO();

        responseDTO.setId(claim.getId());
        responseDTO.setPolicyId(claim.getPolicy().getId());

        responseDTO.setCustomerName(
                claim.getCustomer().getFirstName() + " " + claim.getCustomer().getLastName()
        );

        responseDTO.setClaimType(claim.getClaimType());
        responseDTO.setIncidentDate(claim.getIncidentDate());
        responseDTO.setClaimAmount(claim.getClaimAmount());
        responseDTO.setStatus(claim.getStatus());
        responseDTO.setFraudScore(claim.getFraudScore());
        responseDTO.setSurveyorId(claim.getSurveyorId());

        return responseDTO;
    }
}