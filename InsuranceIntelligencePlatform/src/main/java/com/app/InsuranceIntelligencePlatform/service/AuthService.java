package com.app.InsuranceIntelligencePlatform.service;

import com.app.InsuranceIntelligencePlatform.dto.AuthResponse;
import com.app.InsuranceIntelligencePlatform.dto.LoginRequest;
import com.app.InsuranceIntelligencePlatform.dto.RegisterRequest;
import com.app.InsuranceIntelligencePlatform.entity.User;
import com.app.InsuranceIntelligencePlatform.enums.UserStatus;
import com.app.InsuranceIntelligencePlatform.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                "User registered successfully",
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean isPasswordMatching = passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        );

        if (!isPasswordMatching) {
            throw new RuntimeException("Invalid email or password");
        }

        return new AuthResponse(
                "Login successful",
                user.getEmail(),
                user.getRole().name()
        );
    }
}