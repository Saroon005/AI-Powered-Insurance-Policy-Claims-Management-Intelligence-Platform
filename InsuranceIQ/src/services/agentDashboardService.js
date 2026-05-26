import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getAgents = async () => {
  const response = await axios.get(`${API_BASE_URL}/agents`);
  return response.data;
};

export const getPolicies = async () => {
  const response = await axios.get(`${API_BASE_URL}/policies`);
  return response.data;
};

export const getClaims = async () => {
  const response = await axios.get(`${API_BASE_URL}/claims`);
  return response.data;
};