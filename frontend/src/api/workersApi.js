const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export const fetchWorkers = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/workers${params.toString() ? `?${params.toString()}` : ""}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load workers");
  }

  return data;
};

export const addWorker = async (workerData) => {
  const response = await fetch(`${API_URL}/workers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to register worker");
  }

  return data;
};
