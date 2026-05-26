import api from "./api";

export const getCustomers = async () => {
  const response = await api.get("/customers");
  return response.data;
};