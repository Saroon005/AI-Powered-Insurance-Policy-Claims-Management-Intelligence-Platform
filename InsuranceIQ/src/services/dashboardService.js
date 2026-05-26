import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getPolicies = async () => {
  const response = await axios.get(`${API_URL}/policies`);
  return response.data;
};

export const getClaims = async () => {
  const response = await axios.get(`${API_URL}/claims`);
  return response.data;
};

export const getAgents = async () => {
  const response = await axios.get(`${API_URL}/agents`);
  return response.data;
};

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};