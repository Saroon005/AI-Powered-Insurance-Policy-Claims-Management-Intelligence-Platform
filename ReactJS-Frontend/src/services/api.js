import axios from 'axios';

const SPRING_BASE = import.meta.env.VITE_SPRING_BASE || 'http://localhost:8081/api';
const PYTHON_BASE = import.meta.env.VITE_PYTHON_BASE || 'http://localhost:8000';

export const springApi = axios.create({ baseURL: SPRING_BASE });
export const pythonApi = axios.create({ baseURL: PYTHON_BASE });

springApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const login = (data) => springApi.post('/auth/login', data);
export const register = (data) => springApi.post('/auth/register', data);

// AGENTS
export const getAgents = () => springApi.get('/agents');
export const createAgent = (data) => springApi.post('/agents', data);
export const updateAgent = (id, data) => springApi.put(`/agents/${id}`, data);
export const deleteAgent = (id) => springApi.delete(`/agents/${id}`);

// CUSTOMERS
export const getCustomers = () => springApi.get('/customers');
export const createCustomer = (data) => springApi.post('/customers', data);
export const updateCustomer = (id, data) => springApi.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => springApi.delete(`/customers/${id}`);

// POLICIES
export const getPolicies = () => springApi.get('/policies');
export const createPolicy = (data) => springApi.post('/policies', data);
export const updatePolicy = (id, data) => springApi.put(`/policies/${id}`, data);
export const deletePolicy = (id) => springApi.delete(`/policies/${id}`);

// CLAIMS
export const getClaims = () => springApi.get('/claims');
export const getClaimById = (id) => springApi.get(`/claims/${id}`);
export const createClaim = (data) => springApi.post('/claims', data);
export const updateClaimStatus = (id, status) => springApi.put(`/claims/${id}/status?status=${status}`);
export const deleteClaim = (id) => springApi.delete(`/claims/${id}`);

// PRODUCTS
export const getProducts = () => springApi.get('/products');
export const createProduct = (data) => springApi.post('/products', data);

// FRAUD
export const checkFraud = (claimId) => springApi.post(`/fraud/check/${claimId}`);

// PYTHON - INTELLIGENCE
export const getFraudSummary = () => pythonApi.get('/intelligence/fraud-summary');
export const getLossRatio = () => pythonApi.get('/intelligence/loss-ratio');
export const getAgentPerformance = () => pythonApi.get('/intelligence/agent-performance');
export const getClaimSeverity = () => pythonApi.get('/intelligence/claim-severity');
export const getClaimTypes = () => pythonApi.get('/intelligence/claim-types');
export const getRegionRisk = () => pythonApi.get('/intelligence/region-risk');
export const getKPIs = () => pythonApi.get('/intelligence/kpis');
export const getClaimsTrend = () => pythonApi.get('/analytics/claims-trend');
export const getTopAgents = () => pythonApi.get('/analytics/top-agents');
export const predictFraud = (claimId) => pythonApi.post(`/fraud/predict/${claimId}`);
