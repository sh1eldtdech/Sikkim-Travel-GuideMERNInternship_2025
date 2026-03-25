import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: false,
});

// Auto-attach owner OR user token from localStorage
API.interceptors.request.use((config) => {
  const ownerToken = localStorage.getItem("ownerToken");
  const userToken = localStorage.getItem("userToken");
  const token = ownerToken || userToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
