import { BASE_API_URL } from "./apiConfig.js";
import { apiRequest, toQueryString } from "./apiClient.js";

export const fetchTransporters = (filters = {}) =>
  apiRequest(`${BASE_API_URL}/transporters${toQueryString(filters)}`, {
    fallbackError: "Unable to load transport providers",
  });

export const addTransporter = (transporterData, token = "") =>
  apiRequest(`${BASE_API_URL}/transporters`, {
    method: "POST",
    body: transporterData,
    token,
    fallbackError: "Unable to add transporter",
  });
