package com.app.InsuranceIntelligencePlatform.dto;

public class AuthResponse {

    private String message;
    private String email;
    private String role;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(String message, String email, String role, String token) {
        this.message = message;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setToken(String token) {
        this.token = token;
    }
}