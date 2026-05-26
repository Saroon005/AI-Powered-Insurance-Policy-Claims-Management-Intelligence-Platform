import api from "./api";

export const getClaims = async () => {
  const response = await api.get("/claims");
  return response.data;
};

export const createClaim = async (data) => {
  const response = await api.post("/claims", data);
  return response.data;
};

export const updateClaimStatus = async (id, status) => {
  const response = await api.put(
    `/claims/${id}/status?status=${status}`
  );

  return response.data;
};