# InsuranceIQ — ReactJS Frontend



---

## Overview

This is the complete ReactJS frontend for the InsuranceIQ platform. It connects to all 3 backend services:

| Backend | Port | Purpose |
|---------|------|---------|
| Spring Boot | 8081 | Auth, CRUD APIs |
| Python FastAPI | 8000 | ML Fraud Detection + Analytics |
| Node.js Socket.IO | 5001 | Real-time Notifications |

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React.js 18 | Frontend framework |
| Vite | Build tool |
| React Router v6 | Role-based routing |
| Axios | API calls to Spring Boot + Python |
| Socket.IO Client | Real-time notifications from Node.js |
| Recharts | Analytics charts and graphs |
| Context API | Global auth + notification state |

---

## Pages Implemented (10 Pages)

| Page | Route | Access |
|------|-------|--------|
| Login / Register | `/login` | All |
| Admin Dashboard | `/admin` | Admin, Claims Manager |
| Agent Dashboard | `/agent` | Agent |
| Customer Dashboard | `/customer` | Customer |
| Customer Onboarding & KYC | `/customers` | All |
| Policy Issuance & Management | `/policies` | All |
| Claims Submission | `/claims` | All |
| Claims Assessment & Workflow | `/claims-assessment` | Admin, Claims Manager |
| Fraud Detection Report | `/fraud` | Admin, Claims Manager |
| Analytics Dashboard | `/analytics` | Admin, Claims Manager |
| Notifications Centre | `/notifications` | All |

---

## Features

- JWT Authentication with role-based routing
- Admin Dashboard with platform-wide stats
- Agent Dashboard with customer portfolio and renewal alerts
- Customer Dashboard with policy cards and claim history
- Customer Onboarding form with KYC steps
- Policy issuance form with product dropdown
- Claims submission with lifecycle tracker
- Claims assessment queue with Approve / Reject / Settle / Escalate
- AI Fraud Detection powered by Python ML (Random Forest)
- Analytics Dashboard with Recharts — loss ratio, agent performance, claim trends
- Real-time Notifications Centre via Socket.IO
- Dark theme UI matching InsuranceIQ design system

---

## Project Structure

```
ReactJS-Frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AgentDashboard.jsx
│   │   ├── CustomerDashboard.jsx
│   │   ├── CustomerOnboarding.jsx
│   │   ├── PolicyManagement.jsx
│   │   ├── ClaimsSubmission.jsx
│   │   ├── ClaimsAssessment.jsx
│   │   ├── FraudDetection.jsx
│   │   ├── AnalyticsDashboard.jsx
│   │   ├── NotificationsCentre.jsx
│   │   └── AgentsPage.jsx
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Layout.jsx
│   │   └── UI.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── socketService.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Backend Changes Made for Frontend Integration

### 1. SecurityConfig.java (Spring Boot)
Added CORS configuration to allow React frontend requests:
```java
@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
        }
    };
}
```

### 2. database.py (Python Backend)
Fixed MySQL password encoding to handle special characters:
```python
from urllib.parse import quote_plus
password = quote_plus(settings.MYSQL_PASSWORD)
DATABASE_URL = f"mysql+pymysql://{settings.MYSQL_USER}:{password}@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}"
```

---

## Setup Instructions for Teammates

### Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| Git | Latest | https://git-scm.com |

---

### Step 1 — Make sure all backends are running

Before starting frontend, confirm these are running:

```
Spring Boot  → http://localhost:8081
Python       → http://localhost:8000
Node.js      → http://localhost:5001
MySQL        → localhost:3306
```

---

### Step 2 — Clone the repository

```bash
# Enable long paths first (Windows)
git config --system core.longpaths true

# Clone to short path
cd C:\
mkdir projects
cd C:\projects
git clone -b dev https://github.com/Saroon005/AI-Powered-Insurance-Policy-Claims-Management-Intelligence-Platform.git
```

---

### Step 3 — Go to frontend folder

```bash
cd "C:\projects\AI-Powered-Insurance-Policy-Claims-Management-Intelligence-Platform\ReactJS-Frontend"
```

---

### Step 4 — Install dependencies

```bash
npm install
```

---

### Step 5 — Start the frontend

```bash
npm run dev
```

---

### Step 6 — Open browser

```
http://localhost:3000
```

---

### Step 7 — Register your first user

Click **Register** tab and create:

```
Name: Admin User
Email: admin@insuranceiq.in
Password: Admin@123
Role: ADMIN
```

---

## Test All Roles

Register these users to test all role dashboards:

| Role | Email | Password |
|------|-------|---------|
| ADMIN | admin@insuranceiq.in | Admin@123 |
| AGENT | agent@insuranceiq.in | Agent@123 |
| CUSTOMER | customer@insuranceiq.in | Customer@123 |
| CLAIMS_MANAGER | claims@insuranceiq.in | Claims@123 |

---

## Test Flow (End to End)

```
1. Login as ADMIN
2. Go to Agents → Add new agent
3. Go to Customers → Onboard new customer
4. Go to Policies → Issue new policy (need product first)
5. Go to Claims → File new claim
6. Go to Claims Assessment → Approve/Reject claim
7. Go to Fraud Detection → Run ML fraud analysis
8. Go to Analytics → View charts
9. Go to Notifications → See real-time events
10. Logout → Login as AGENT / CUSTOMER to test other roles
```

---

## Create Insurance Product (Required before issuing policies)

Use Postman:
```
POST http://localhost:8081/api/products
Content-Type: application/json

{
  "productName": "Health Shield Pro",
  "productType": "HEALTH",
  "coverageAmount": 500000,
  "premiumRate": 0.045,
  "termMonths": 12,
  "status": "ACTIVE"
}
```

---

## Load Analytics Data (Required for charts)

Run these in Postman after Python service starts:
```
POST http://localhost:8000/bulk-import/agents
POST http://localhost:8000/bulk-import/customers
POST http://localhost:8000/bulk-import/policies
POST http://localhost:8000/bulk-import/claims
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| CORS error | Make sure SecurityConfig.java is updated |
| Python DB error | Make sure database.py uses quote_plus |
| Socket not connecting | Make sure Node.js is running on port 5001 |
| Login fails | Make sure Spring Boot is running on port 8081 |
| Charts empty | Run bulk import endpoints on Python |
| npm install fails | Enable long paths: `git config --system core.longpaths true` |

---

## API Connections

```
React (localhost:3000)
    ↓
Spring Boot (localhost:8081)  →  MySQL (insurance_iq)
    ↓
Python FastAPI (localhost:8000)  →  MySQL (insurance_ai)
    ↓
Node.js (localhost:5001)  →  Socket.IO → React (real-time)
```

---

## Developed By

**Dilpreet** — ReactJS Frontend Module  
AI-Powered Insurance Policy & Claims Management Intelligence Platform  
Capstone Project — Full Stack + AI + Cloud
