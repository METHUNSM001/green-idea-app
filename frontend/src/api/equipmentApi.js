import { BASE_API_URL } from "./apiConfig.js";
import { apiRequest, toQueryString } from "./apiClient.js";

const EQUIPMENT_URL = `${BASE_API_URL}/services/equipment`;

export const fetchEquipment = (filters = {}) =>
  apiRequest(`${EQUIPMENT_URL}${toQueryString(filters)}`, {
    fallbackError: "Unable to load equipment",
  });

export const addEquipment = (equipmentData) =>
  apiRequest(EQUIPMENT_URL, {
    method: "POST",
    body: equipmentData,
    fallbackError: "Unable to register equipment",
  });
