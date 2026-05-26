package com.app.InsuranceIntelligencePlatform.service;

import com.app.InsuranceIntelligencePlatform.dto.CustomerRequestDTO;
import com.app.InsuranceIntelligencePlatform.dto.CustomerResponseDTO;
import com.app.InsuranceIntelligencePlatform.entity.Customer;
import com.app.InsuranceIntelligencePlatform.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public CustomerResponseDTO createCustomer(CustomerRequestDTO requestDTO) {

        Customer customer = new Customer();

        customer.setFirstName(requestDTO.getFirstName());
        customer.setLastName(requestDTO.getLastName());
        customer.setEmail(requestDTO.getEmail());
        customer.setPhoneNumber(requestDTO.getPhoneNumber());
        customer.setAddress(requestDTO.getAddress());
        customer.setCity(requestDTO.getCity());
        customer.setState(requestDTO.getState());
        customer.setCountry(requestDTO.getCountry());
        customer.setZipCode(requestDTO.getZipCode());

        Customer savedCustomer = customerRepository.save(customer);

        return mapToResponseDTO(savedCustomer);
    }

    public List<CustomerResponseDTO> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public CustomerResponseDTO getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        return mapToResponseDTO(customer);
    }

    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO requestDTO) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setFirstName(requestDTO.getFirstName());
        customer.setLastName(requestDTO.getLastName());
        customer.setEmail(requestDTO.getEmail());
        customer.setPhoneNumber(requestDTO.getPhoneNumber());
        customer.setAddress(requestDTO.getAddress());
        customer.setCity(requestDTO.getCity());
        customer.setState(requestDTO.getState());
        customer.setCountry(requestDTO.getCountry());
        customer.setZipCode(requestDTO.getZipCode());

        Customer updatedCustomer = customerRepository.save(customer);

        return mapToResponseDTO(updatedCustomer);
    }

    public void deleteCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customerRepository.delete(customer);
    }

    private CustomerResponseDTO mapToResponseDTO(Customer customer) {

        CustomerResponseDTO responseDTO = new CustomerResponseDTO();

        responseDTO.setId(customer.getId());
        responseDTO.setFirstName(customer.getFirstName());
        responseDTO.setLastName(customer.getLastName());
        responseDTO.setEmail(customer.getEmail());
        responseDTO.setPhoneNumber(customer.getPhoneNumber());
        responseDTO.setCity(customer.getCity());
        responseDTO.setState(customer.getState());
        responseDTO.setCountry(customer.getCountry());

        return responseDTO;
    }
}