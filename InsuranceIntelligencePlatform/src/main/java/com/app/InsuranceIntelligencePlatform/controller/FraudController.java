package com.app.InsuranceIntelligencePlatform.controller;

import com.app.InsuranceIntelligencePlatform.dto.FraudResponseDTO;
import com.app.InsuranceIntelligencePlatform.service.FraudService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fraud")
public class FraudController {

    private final FraudService fraudService;

    public FraudController(FraudService fraudService) {
        this.fraudService = fraudService;
    }

    @PostMapping("/check/{claimId}")
    public ResponseEntity<FraudResponseDTO> checkFraud(@PathVariable Long claimId) {
        return ResponseEntity.ok(fraudService.checkFraud(claimId));
    }
}