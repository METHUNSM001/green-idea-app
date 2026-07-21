import { BASE_API_URL } from "./apiConfig.js";
import { apiRequest, toQueryString } from "./apiClient.js";

export const fetchWorkers = (filters = {}) =>
  apiRequest(`${BASE_API_URL}/workers${toQueryString(filters)}`, {
    fallbackError: "Unable to load workers",
  });

export const addWorker = (workerData) =>
  apiRequest(`${BASE_API_URL}/workers`, {
    method: "POST",
    body: workerData,
    fallbackError: "Unable to register worker",
  });
