// Set VITE_API_URL in .env (local dev) or in your Vercel project's
// Environment Variables (production) - see .env.example.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  // Fail loudly in a production build instead of silently calling
  // localhost, which is what a stale dev-tunnel fallback used to do here.
  console.error(
    "VITE_API_URL is not set. Set it in your Vercel project's Environment Variables and redeploy."
  );
}

export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
export const BASE_API_URL = `${API_BASE_URL}/api`;
export default API_BASE_URL;
