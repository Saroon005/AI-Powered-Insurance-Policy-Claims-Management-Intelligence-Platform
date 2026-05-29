# Insurance Intelligence Platform

An end-to-end intelligent insurance platform built using Spring Boot, ReactJS, FastAPI, NodeJS, and MySQL. The platform enables customer onboarding, policy management, claims processing, fraud detection, notifications, and secure role-based access.

---

# Tech Stack

```text
Backend        : Spring Boot (Java 21)
Frontend       : ReactJS
Database       : MySQL
Authentication : JWT + Spring Security
ML Service     : FastAPI + Logistic Regression
Notifications  : NodeJS
API Docs       : Swagger/OpenAPI
Cloud          : AWS (Planned)
```

---

# Day 1 — Backend Foundation

## Project Initialization

### Completed

- Created Spring Boot Project
- Configured Java 21
- Maven Setup
- Base Package Structure
- Environment Variables using `.env`

### Database Configuration

- Configured MySQL datasource
- Configured Hibernate / JPA
- Automatic table generation enabled

### Authentication Module

Implemented:

- User Entity
- Role Management
- BCrypt Password Encryption
- Register API
- Login API
- JWT Token Generation
- Spring Security Configuration

### Authentication APIs

```http
POST /api/auth/register

POST /api/auth/login
```

---

# Day 2 — Insurance Business Modules

## Customer Module

Implemented:

- Customer Entity
- DTO Architecture
- CRUD APIs
- Validation

### APIs

```http
POST   /api/customers

GET    /api/customers

GET    /api/customers/{id}

PUT    /api/customers/{id}

DELETE /api/customers/{id}
```

---

## Agent Module

Implemented:

- Agent Entity
- DTO Architecture
- CRUD APIs

### APIs

```http
POST   /api/agents

GET    /api/agents

PUT    /api/agents/{id}

DELETE /api/agents/{id}
```

---

## Insurance Product Module

Implemented:

- Insurance Product Entity
- Product CRUD APIs

### APIs

```http
POST   /api/products

GET    /api/products

PUT    /api/products/{id}

DELETE /api/products/{id}
```

---

## Policy Module

### Relationships

```text
Customer ← Policy → Agent
                 ↓
         Insurance Product
```

Implemented:

- Policy Entity
- Foreign Key Relationships
- DTO Architecture
- Policy CRUD APIs

### APIs

```http
POST   /api/policies

GET    /api/policies

PUT    /api/policies/{id}

DELETE /api/policies/{id}
```

---

## Claims Module

Implemented:

- Claims Intake API
- Claim Status Management
- Fraud Score Support

### APIs

```http
POST /api/claims

GET /api/claims

PUT /api/claims/{id}/status
```

---

# Day 3 — Intelligent Platform Integration

## Fraud Detection Integration

### Architecture

```text
Spring Boot
     ↓
FastAPI Fraud Service
     ↓
Fraud Score Generated
     ↓
Stored in Database
```

Implemented:

- Spring Boot ↔ FastAPI Integration
- Real-Time Fraud Prediction
- Fraud Score Persistence

### API

```http
POST /api/fraud/check/{claimId}
```

---

## Notification Integration

### Architecture

```text
Spring Boot
     ↓
NodeJS Notification Service
     ↓
Real-Time Notifications
```

Implemented:

- Claim Filed Notifications
- Fraud Notifications
- Claim Status Notifications

---

## Security Enhancements

Implemented:

- JWT Authentication
- Role Based Access Control (RBAC)
- Protected APIs
- Secure Endpoints

### Roles

```text
ADMIN

AGENT

CUSTOMER

CLAIMS_MANAGER
```

---

## Validation & Exception Handling

Implemented:

- Global Exception Handling
- DTO Validation
- Clean Error Responses

---

## API Documentation

Implemented:

- Swagger / OpenAPI Documentation
- Interactive API Testing

Access:

```text
http://localhost:8081/swagger-ui/index.html
```

---

# Architecture

```text
React Frontend
      ↓

Spring Boot Backend
      ↓

MySQL Database

      ↓

FastAPI Fraud Service

      ↓

NodeJS Notification Service
```

---

# Current Status

```text
✓ Authentication Complete

✓ Business Modules Complete

✓ Claims Management Complete

✓ Fraud Detection Complete

✓ Notifications Complete

✓ Secure APIs Complete

✓ Documentation Complete

✓ Production Preparation In Progress
```

---

# Future Enhancements

```text
Dockerization

AWS S3 Uploads

Deployment Pipeline

Monitoring & Logging

Production Configurations
```

---

# Running the Project

## Clone Repository

```bash
git clone <repository-url>

cd InsuranceIntelligencePlatform
```

## Configure Environment Variables

Create:

```text
.env
```

Add:

```env
DB_USERNAME=root

DB_PASSWORD=password

JWT_SECRET=your_secret_key

JWT_EXPIRATION=86400000
```

## Run Application

```bash
mvn clean install

mvn spring-boot:run
```

Backend Runs On:

```text
http://localhost:8081
```

Swagger:

```text
http://localhost:8081/swagger-ui/index.html
```

---

# Author

```text
Dilpreet Singh

Backend Developer

Insurance Intelligence Platform

Spring Boot | Java | Microservices | Security
```
