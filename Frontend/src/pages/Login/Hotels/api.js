// src/pages/Hotels/api.js
// Centralized API helper for Hotel Module

const BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper: returns auth headers for user or owner
export const getAuthHeaders = (role = "user") => {
  const key = role === "owner" ? "ownerToken" : "token";
  const token = localStorage.getItem(key);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper
const apiFetch = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// Public Hotel APIs
export const fetchHotels = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/hotels${query ? "?" + query : ""}`);
};

export const fetchHotelById = (id) => apiFetch(`/hotels/${id}`);

// User Auth APIs
export const registerUser = (data) =>
  apiFetch("/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  apiFetch("/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// Booking APIs
export const createOrder = (data) =>
  apiFetch("/bookings/create-order", {
    method: "POST",
    headers: getAuthHeaders("user"),
    body: JSON.stringify(data),
  });

export const verifyPayment = (data) =>
  apiFetch("/bookings/verify-payment", {
    method: "POST",
    headers: getAuthHeaders("user"),
    body: JSON.stringify(data),
  });

export const fetchMyBookings = () =>
  apiFetch("/bookings/my-bookings", {
    headers: getAuthHeaders("user"),
  });

//  Auth APIs
export const loginOwner = (data) =>
  apiFetch("/owner/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// Owner register uses FormData (file upload)
export const registerOwner = (formData) =>
  fetch(`${BASE_URL}/owner/register`, {
    method: "POST",
    body: formData, // No Content-Type header — browser sets it with boundary
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  });

// Owner Hotel/Room APIs
export const fetchOwnerHotels = () =>
  apiFetch("/hotels/owner/my-hotels", {
    headers: getAuthHeaders("owner"),
  });

// Add hotel uses FormData (image upload)
export const addHotel = (formData) =>
  fetch(`${BASE_URL}/hotels/add`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("ownerToken")}` },
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add hotel");
    return data;
  });

export const addRoom = (data) =>
  apiFetch("/rooms/add", {
    method: "POST",
    headers: getAuthHeaders("owner"),
    body: JSON.stringify(data),
  });

export const updateRoom = (roomId, data) =>
  apiFetch(`/rooms/${roomId}`, {
    method: "PUT",
    headers: getAuthHeaders("owner"),
    body: JSON.stringify(data),
  });

export const fetchOwnerBookings = () =>
  apiFetch("/bookings/owner/bookings", {
    headers: getAuthHeaders("owner"),
  });
