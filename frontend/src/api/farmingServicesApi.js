import { BASE_API_URL } from "./apiConfig.js";

const API_URL = BASE_API_URL;

export const fetchFarmingServices = async (serviceKey, filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/farming-services/${serviceKey}${params.toString() ? `?${params.toString()}` : ""}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load farming services");
  }

  return data;
};

export const addFarmingService = async (serviceKey, serviceData) => {
  const response = await fetch(`${API_URL}/farming-services/${serviceKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to register service");
  }

  return data;
};
