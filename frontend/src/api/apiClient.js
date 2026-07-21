// Shared request helper used by every file in this folder. Each API
// call used to hand-roll its own fetch + JSON-parse + error-check; that
// meant 5 slightly different copies of the same logic, and none of them
// handled a non-JSON error response (e.g. a gateway timeout page) - that
// would throw a confusing "Unexpected token <" instead of a useful
// message. This version centralizes it once.

export async function apiRequest(url, { method = "GET", body, token, fallbackError = "Request failed" } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Unable to reach the server. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || fallbackError);
  }
  return data;
}

// Turns { city: "X", district: "" } into "?city=X" - drops empty values
// instead of every caller re-writing this loop.
export function toQueryString(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
