// src/pages/Hotels/api.js
// Centralized API helper for Hotel Module

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// Generic fetch wrapper
const apiFetch = async (url, options = {}) => {
  const hasFormDataBody = options.body instanceof FormData;
  const defaultHeaders = hasFormDataBody
    ? {}
    : { "Content-Type": "application/json" };

  const res = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });
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
    body: JSON.stringify(data),
  });

export const loginUser = (data) =>
  apiFetch("/user/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getCurrentUser = () => apiFetch("/user/me");

// Booking APIs
export const createOrder = (data) =>
  apiFetch("/bookings/create-order", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyPayment = (data) =>
  apiFetch("/bookings/verify-payment", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchMyBookings = () => apiFetch("/bookings/my-bookings");

//  Auth APIs
export const loginOwner = (data) =>
  apiFetch("/owner/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchOwnerMe = () => apiFetch("/owner/me");

export const logoutOwner = () =>
  apiFetch("/owner/logout", {
    method: "POST",
  });

// Owner register uses FormData (file upload)
export const registerOwner = (formData) =>
  fetch(`${BASE_URL}/owner/register`, {
    method: "POST",
    credentials: "include",
    body: formData, // No Content-Type header — browser sets it with boundary
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  });

// Owner Hotel/Room APIs
export const fetchOwnerHotels = () => apiFetch("/hotels/owner/my-hotels");

// Add hotel uses FormData (image upload)
export const addHotel = (formData) =>
  fetch(`${BASE_URL}/hotels/add`, {
    method: "POST",
    credentials: "include",
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add hotel");
    return data;
  });

export const addRoom = (data) =>
  apiFetch("/rooms/add", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateRoom = (roomId, data) =>
  apiFetch(`/rooms/${roomId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const fetchOwnerBookings = () => apiFetch("/bookings/owner/bookings");
