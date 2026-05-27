package com.app.InsuranceIntelligencePlatform.service;

import com.app.InsuranceIntelligencePlatform.dto.AgentRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.AgentResponseDTO;
import com.app.InsuranceIntelligencePlatform.entity.Agent;
import com.app.InsuranceIntelligencePlatform.repository.AgentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentService {

    private final AgentRepository agentRepository;

    public AgentService(AgentRepository agentRepository) {
        this.agentRepository = agentRepository;
    }

    public AgentResponseDTO createAgent(AgentRequestDTO requestDTO) {

        Agent agent = new Agent();

        agent.setLicenseNo(requestDTO.getLicenseNo());
        agent.setFirstName(requestDTO.getFirstName());
        agent.setLastName(requestDTO.getLastName());
        agent.setEmail(requestDTO.getEmail());
        agent.setPhoneNumber(requestDTO.getPhoneNumber());
        agent.setRegion(requestDTO.getRegion());
        agent.setCommissionPct(requestDTO.getCommissionPct());
        agent.setStatus(requestDTO.getStatus());

        Agent savedAgent = agentRepository.save(agent);

        return mapToResponseDTO(savedAgent);
    }

    public List<AgentResponseDTO> getAllAgents() {

        return agentRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public AgentResponseDTO getAgentById(Long id) {

        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return mapToResponseDTO(agent);
    }

    public AgentResponseDTO updateAgent(Long id,
                                        AgentRequestDTO requestDTO) {

        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        agent.setLicenseNo(requestDTO.getLicenseNo());
        agent.setFirstName(requestDTO.getFirstName());
        agent.setLastName(requestDTO.getLastName());
        agent.setEmail(requestDTO.getEmail());
        agent.setPhoneNumber(requestDTO.getPhoneNumber());
        agent.setRegion(requestDTO.getRegion());
        agent.setCommissionPct(requestDTO.getCommissionPct());
        agent.setStatus(requestDTO.getStatus());

        Agent updatedAgent = agentRepository.save(agent);

        return mapToResponseDTO(updatedAgent);
    }

    public void deleteAgent(Long id) {

        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        agentRepository.delete(agent);
    }

    private AgentResponseDTO mapToResponseDTO(Agent agent) {

        AgentResponseDTO responseDTO = new AgentResponseDTO();

        responseDTO.setId(agent.getId());
        responseDTO.setLicenseNo(agent.getLicenseNo());
        responseDTO.setFirstName(agent.getFirstName());
        responseDTO.setLastName(agent.getLastName());
        responseDTO.setEmail(agent.getEmail());
        responseDTO.setPhoneNumber(agent.getPhoneNumber());
        responseDTO.setRegion(agent.getRegion());
        responseDTO.setCommissionPct(agent.getCommissionPct());
        responseDTO.setStatus(agent.getStatus());

        return responseDTO;
    }
}