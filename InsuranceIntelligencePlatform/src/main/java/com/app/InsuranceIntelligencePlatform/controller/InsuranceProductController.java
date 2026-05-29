package com.app.InsuranceIntelligencePlatform.controller;

import com.app.InsuranceIntelligencePlatform.dto.InsuranceProductRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.InsuranceProductResponseDTO;
import com.app.InsuranceIntelligencePlatform.service.InsuranceProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class InsuranceProductController {

    private final InsuranceProductService insuranceProductService;

    public InsuranceProductController(InsuranceProductService insuranceProductService) {
        this.insuranceProductService = insuranceProductService;
    }

    @PostMapping
    public ResponseEntity<InsuranceProductResponseDTO> createProduct(
            @RequestBody InsuranceProductRequestDTO requestDTO) {

        return ResponseEntity.ok(
                insuranceProductService.createProduct(requestDTO)
        );
    }

    @GetMapping
    public ResponseEntity<List<InsuranceProductResponseDTO>> getAllProducts() {

        return ResponseEntity.ok(
                insuranceProductService.getAllProducts()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsuranceProductResponseDTO> getProductById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                insuranceProductService.getProductById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsuranceProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody InsuranceProductRequestDTO requestDTO) {

        return ResponseEntity.ok(
                insuranceProductService.updateProduct(id, requestDTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long id) {

        insuranceProductService.deleteProduct(id);

        return ResponseEntity.ok("Insurance product deleted successfully");
    }
}