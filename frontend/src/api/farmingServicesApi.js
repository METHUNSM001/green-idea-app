const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

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
