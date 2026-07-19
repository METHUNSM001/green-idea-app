const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cyan-dingos-call.loca.lt";

export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
export const BASE_API_URL = `${API_BASE_URL}/api`;
export default API_BASE_URL;
