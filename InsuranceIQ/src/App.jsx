import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PolicyManagement from "./pages/policy/PolicyManagement";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";


import CustomerOnboarding from "./pages/customer/CustomerOnboarding";
import ClaimSubmission from "./pages/claims/ClaimSubmission";

import ClaimsAssessment from "./pages/claims/ClaimsAssessment";
import FraudDetection from "./pages/fraud/FraudDetection";

import ProtectedRoute from "./routes/ProtectedRoute";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Agent Route */}
        <Route
          path="/agent"
          element={
            <ProtectedRoute role="AGENT">
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer Route */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />



        <Route
  path="/policies"
  element={<PolicyManagement />}
/>

<Route
  path="/policies"
  element={<PolicyManagement />}
/>

<Route
  path="/customers"
  element={<CustomerOnboarding />}
/>

<Route
  path="/claims"
  element={<ClaimSubmission />}
/>

<Route
  path="/claims-assessment"
  element={<ClaimsAssessment />}
/>

<Route
  path="/fraud/:claimId"
  element={<FraudDetection />}
/>

<Route
  path="/analytics"
  element={<AnalyticsDashboard />}
/>

<Route
  path="/analytics"
  element={<AnalyticsDashboard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;