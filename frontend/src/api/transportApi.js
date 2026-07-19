const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export const fetchTransporters = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/transporters${params.toString() ? `?${params.toString()}` : ""}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load transport providers");
  }

  return data;
};

export const addTransporter = async (transporterData, token = "") => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/transporters`, {
    method: "POST",
    headers,
    body: JSON.stringify(transporterData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to add transporter");
  }

  return data;
};
