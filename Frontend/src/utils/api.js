import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: false,
});

/**
 * Token priority:
 *  - /bike-owner/* and /bikes/* (owner-write routes) → bikeOwnerToken
 *  - /owner/* and /hotels/* (owner-write routes)    → ownerToken
 *  - all other routes (traveler/user)               → userToken
 *
 * This ensures hotel owner tokens are NEVER sent to bike-owner endpoints
 * and vice versa.
 */
API.interceptors.request.use((config) => {
  const ownerToken    = localStorage.getItem("ownerToken");
  const bikeOwnerToken = localStorage.getItem("bikeOwnerToken");
  const userToken     = localStorage.getItem("userToken");

  const url = config.url || "";

  // Bike-owner protected routes
  if (bikeOwnerToken && (url.startsWith("/bike-owner") || url.startsWith("/bikes/owner"))) {
    config.headers.Authorization = `Bearer ${bikeOwnerToken}`;
    return config;
  }

  // Hotel-owner protected routes
  if (ownerToken && (url.startsWith("/owner") || url.startsWith("/hotels/owner") || url.startsWith("/rooms") || url.startsWith("/bookings/owner"))) {
    config.headers.Authorization = `Bearer ${ownerToken}`;
    return config;
  }

  // Write-routes for bikes (add/update/delete/status) need bikeOwnerToken
  if (bikeOwnerToken && /^\/bikes\/(add|[a-f0-9]+)/.test(url) && config.method !== "get") {
    config.headers.Authorization = `Bearer ${bikeOwnerToken}`;
    return config;
  }

  // Fallback: user token for traveler routes (bookings, etc.)
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
    return config;
  }

  // Last resort: whichever token is available (covers edge cases)
  const fallback = ownerToken || bikeOwnerToken;
  if (fallback) {
    config.headers.Authorization = `Bearer ${fallback}`;
  }

  return config;
});

export default API;
