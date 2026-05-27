package com.app.InsuranceIntelligencePlatform.service;

import com.app.InsuranceIntelligencePlatform.dto.InsuranceProductRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.InsuranceProductResponseDTO;
import com.app.InsuranceIntelligencePlatform.entity.InsuranceProduct;
import com.app.InsuranceIntelligencePlatform.repository.InsuranceProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InsuranceProductService {

    private final InsuranceProductRepository insuranceProductRepository;

    public InsuranceProductService(InsuranceProductRepository insuranceProductRepository) {
        this.insuranceProductRepository = insuranceProductRepository;
    }

    public InsuranceProductResponseDTO createProduct(InsuranceProductRequestDTO requestDTO) {

        InsuranceProduct product = new InsuranceProduct();

        product.setProductName(requestDTO.getProductName());
        product.setProductType(requestDTO.getProductType());
        product.setCoverageAmount(requestDTO.getCoverageAmount());
        product.setPremiumRate(requestDTO.getPremiumRate());
        product.setTermMonths(requestDTO.getTermMonths());
        product.setStatus(requestDTO.getStatus());

        InsuranceProduct savedProduct = insuranceProductRepository.save(product);

        return mapToResponseDTO(savedProduct);
    }

    public List<InsuranceProductResponseDTO> getAllProducts() {

        return insuranceProductRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public InsuranceProductResponseDTO getProductById(Long id) {

        InsuranceProduct product = insuranceProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insurance product not found"));

        return mapToResponseDTO(product);
    }

    public InsuranceProductResponseDTO updateProduct(Long id, InsuranceProductRequestDTO requestDTO) {

        InsuranceProduct product = insuranceProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insurance product not found"));

        product.setProductName(requestDTO.getProductName());
        product.setProductType(requestDTO.getProductType());
        product.setCoverageAmount(requestDTO.getCoverageAmount());
        product.setPremiumRate(requestDTO.getPremiumRate());
        product.setTermMonths(requestDTO.getTermMonths());
        product.setStatus(requestDTO.getStatus());

        InsuranceProduct updatedProduct = insuranceProductRepository.save(product);

        return mapToResponseDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {

        InsuranceProduct product = insuranceProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insurance product not found"));

        insuranceProductRepository.delete(product);
    }

    private InsuranceProductResponseDTO mapToResponseDTO(InsuranceProduct product) {

        InsuranceProductResponseDTO responseDTO = new InsuranceProductResponseDTO();

        responseDTO.setId(product.getId());
        responseDTO.setProductName(product.getProductName());
        responseDTO.setProductType(product.getProductType());
        responseDTO.setCoverageAmount(product.getCoverageAmount());
        responseDTO.setPremiumRate(product.getPremiumRate());
        responseDTO.setTermMonths(product.getTermMonths());
        responseDTO.setStatus(product.getStatus());

        return responseDTO;
    }
}