package com.app.InsuranceIntelligencePlatform.service;

import com.app.InsuranceIntelligencePlatform.dto.NotificationResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    private final RestTemplate restTemplate;

    private static final String NODE_BASE_URL = "http://localhost:5001/notify";

    public NotificationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public NotificationResponseDTO sendClaimFiledNotification(Long claimId, String message) {

        Map<String, Object> request = new HashMap<>();
        request.put("claimId", "CLM" + claimId);
        request.put("message", message);

        return restTemplate.postForObject(
                NODE_BASE_URL + "/claim-filed",
                request,
                NotificationResponseDTO.class
        );
    }

    public NotificationResponseDTO sendClaimStatusUpdatedNotification(
            Long claimId,
            String status,
            String message,
            String targetRoom) {

        Map<String, Object> request = new HashMap<>();
        request.put("claimId", "CLM" + claimId);
        request.put("status", status);
        request.put("message", message);
        request.put("targetRoom", targetRoom);

        return restTemplate.postForObject(
                NODE_BASE_URL + "/claim-status-updated",
                request,
                NotificationResponseDTO.class
        );
    }

    public NotificationResponseDTO sendFraudScoreNotification(
            Long claimId,
            Integer fraudProbability,
            String riskLevel,
            String message) {

        Map<String, Object> request = new HashMap<>();
        request.put("claimId", "CLM" + claimId);
        request.put("fraudProbability", fraudProbability);
        request.put("riskLevel", riskLevel);
        request.put("message", message);

        return restTemplate.postForObject(
                NODE_BASE_URL + "/fraud-score",
                request,
                NotificationResponseDTO.class
        );
    }
}