package com.app.InsuranceIntelligencePlatform.controller;

import com.app.InsuranceIntelligencePlatform.dto.ClaimRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.ClaimResponseDTO;
import com.app.InsuranceIntelligencePlatform.service.ClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ResponseEntity<ClaimResponseDTO> createClaim(
            @RequestBody ClaimRequestDTO requestDTO) {

        return ResponseEntity.ok(claimService.createClaim(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<ClaimResponseDTO>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponseDTO> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(claimService.getClaimById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.ok("Claim deleted successfully");
    }
}