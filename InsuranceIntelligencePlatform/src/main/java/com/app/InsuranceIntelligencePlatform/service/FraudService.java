package com.app.InsuranceIntelligencePlatform.service;

import com.app.InsuranceIntelligencePlatform.dto.FraudRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.FraudResponseDTO;
import com.app.InsuranceIntelligencePlatform.entity.Claim;
import com.app.InsuranceIntelligencePlatform.repository.ClaimRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.temporal.ChronoUnit;

@Service
public class FraudService {

    private final ClaimRepository claimRepository;
    private final RestTemplate restTemplate;

    private final NotificationService notificationService;

    public FraudService(ClaimRepository claimRepository,
                        RestTemplate restTemplate,
                        NotificationService notificationService) {
        this.claimRepository = claimRepository;
        this.restTemplate = restTemplate;
        this.notificationService = notificationService;
    }
    
    public FraudResponseDTO checkFraud(Long claimId) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        long daysSincePolicyStart = ChronoUnit.DAYS.between(
                claim.getPolicy().getStartDate(),
                claim.getIncidentDate()
        );

        FraudRequestDTO requestDTO = new FraudRequestDTO();
        requestDTO.setClaimId(claim.getId());
        requestDTO.setClaimAmount(claim.getClaimAmount());
        requestDTO.setClaimType(claim.getClaimType().name());
        requestDTO.setDaysSincePolicyStart(daysSincePolicyStart);

        String pythonApiUrl = "http://localhost:8000/realtime/process-claim";

        FraudResponseDTO responseDTO = restTemplate.postForObject(
                pythonApiUrl,
                requestDTO,
                FraudResponseDTO.class
        );

        if (responseDTO != null) {
            claim.setFraudScore(responseDTO.getFraudScore());
            claimRepository.save(claim);

            notificationService.sendFraudScoreNotification(
                    claim.getId(),
                    responseDTO.getFraudScore(),
                    responseDTO.getRiskLevel(),
                    "Fraud score generated for claim CLM" + claim.getId()
            );
        }
        return responseDTO;
    }
}