import { BASE_API_URL } from "./apiConfig.js";
import { apiRequest } from "./apiClient.js";

export const getCropRecommendation = (formData) =>
  apiRequest(`${BASE_API_URL}/agriculture/recommend`, {
    method: "POST",
    body: formData,
    fallbackError: "Recommendation failed",
  });

export const getWeatherForecast = (location) =>
  apiRequest(`${BASE_API_URL}/agriculture/weather`, {
    method: "POST",
    body: { location },
    fallbackError: "Weather fetch failed",
  });

export const askFarmingAssistant = (message, language) =>
  apiRequest(`${BASE_API_URL}/agriculture/chat`, {
    method: "POST",
    body: { message, language },
    fallbackError: "Assistant failed",
  });
