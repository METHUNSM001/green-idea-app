import { BASE_API_URL } from "./apiConfig.js";
import { apiRequest, toQueryString } from "./apiClient.js";

export const fetchFarmingServices = (serviceKey, filters = {}) =>
  apiRequest(`${BASE_API_URL}/farming-services/${serviceKey}${toQueryString(filters)}`, {
    fallbackError: "Unable to load farming services",
  });

export const addFarmingService = (serviceKey, serviceData) =>
  apiRequest(`${BASE_API_URL}/farming-services/${serviceKey}`, {
    method: "POST",
    body: serviceData,
    fallbackError: "Unable to register service",
  });
