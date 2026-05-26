import api from "./api";

export const getPolicies = async () => {
  const response = await api.get("/policies");
  return response.data;
};

export const createPolicy = async (data) => {
  const response = await api.post("/policies", data);
  return response.data;
};