import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOnboarding from './pages/CustomerOnboarding';
import PolicyManagement from './pages/PolicyManagement';
import ClaimsSubmission from './pages/ClaimsSubmission';
import ClaimsAssessment from './pages/ClaimsAssessment';
import FraudDetection from './pages/FraudDetection';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import NotificationsCentre from './pages/NotificationsCentre';
import AgentsPage from './pages/AgentsPage';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ background: '#080c14', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4a843', fontFamily: 'monospace' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const routes = { ADMIN: '/admin', CLAIMS_MANAGER: '/admin', AGENT: '/agent', CUSTOMER: '/customer' };
  return <Navigate to={routes[user.role] || '/admin'} replace />;
};

function AppRoutes() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN', 'CLAIMS_MANAGER']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/agent" element={<ProtectedRoute roles={['AGENT']}><AgentDashboard /></ProtectedRoute>} />
        <Route path="/customer" element={<ProtectedRoute roles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />

        <Route path="/customers" element={<ProtectedRoute><CustomerOnboarding /></ProtectedRoute>} />
        <Route path="/agents" element={<ProtectedRoute roles={['ADMIN']}><AgentsPage /></ProtectedRoute>} />
        <Route path="/policies" element={<ProtectedRoute><PolicyManagement /></ProtectedRoute>} />
        <Route path="/claims" element={<ProtectedRoute><ClaimsSubmission /></ProtectedRoute>} />
        <Route path="/claims-assessment" element={<ProtectedRoute roles={['ADMIN', 'CLAIMS_MANAGER']}><ClaimsAssessment /></ProtectedRoute>} />
        <Route path="/fraud" element={<ProtectedRoute roles={['ADMIN', 'CLAIMS_MANAGER']}><FraudDetection /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute roles={['ADMIN', 'CLAIMS_MANAGER']}><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsCentre /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
