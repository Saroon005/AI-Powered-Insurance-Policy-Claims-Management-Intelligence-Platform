package com.app.InsuranceIntelligencePlatform.controller;

import com.app.InsuranceIntelligencePlatform.dto.AgentRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.AgentResponseDTO;
import com.app.InsuranceIntelligencePlatform.service.AgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping
    public ResponseEntity<AgentResponseDTO> createAgent(
            @RequestBody AgentRequestDTO requestDTO) {

        return ResponseEntity.ok(
                agentService.createAgent(requestDTO)
        );
    }

    @GetMapping
    public ResponseEntity<List<AgentResponseDTO>> getAllAgents() {

        return ResponseEntity.ok(
                agentService.getAllAgents()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentResponseDTO> getAgentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                agentService.getAgentById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgentResponseDTO> updateAgent(
            @PathVariable Long id,
            @RequestBody AgentRequestDTO requestDTO) {

        return ResponseEntity.ok(
                agentService.updateAgent(id, requestDTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAgent(
            @PathVariable Long id) {

        agentService.deleteAgent(id);

        return ResponseEntity.ok("Agent deleted successfully");
    }
}