import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

const getRefreshEndpoint = (url = "", method = "get") => {
  const lowerMethod = method.toLowerCase();

  if (url.startsWith("/admin") || url.startsWith("/admin-auth")) {
    return "/admin-auth/refresh";
  }

  if (
    url.startsWith("/bike-owner") ||
    url.startsWith("/bikes/owner") ||
    url.startsWith("/bike-bookings") ||
    (url.startsWith("/bikes/") && lowerMethod !== "get")
  ) {
    return "/bike-owner/refresh";
  }

  if (
    url.startsWith("/owner") ||
    url.startsWith("/hotels/owner") ||
    url.startsWith("/rooms") ||
    url.startsWith("/bookings/owner")
  ) {
    return "/owner/refresh";
  }

  if (url.startsWith("/gov") || url.startsWith("/notices")) {
    return "/gov/refresh";
  }

  return "/user/refresh";
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";

    const isRefreshRoute =
      /\/(user|owner|bike-owner|admin-auth|gov)\/refresh$/.test(url);
    const isAuthRoute =
      /\/(user|owner|bike-owner|admin-auth|gov)\/(login|register|logout)$/.test(
        url,
      );

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRoute &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      // Serialized refresh: avoid multiple concurrent refresh requests
      if (!API._isRefreshing) API._isRefreshing = false;
      if (!API._failedQueue) API._failedQueue = [];

      const enqueue = () =>
        new Promise((resolve, reject) => {
          API._failedQueue.push({ resolve, reject });
        });

      const processQueue = (err) => {
        API._failedQueue.forEach((p) => {
          if (err) p.reject(err);
          else p.resolve();
        });
        API._failedQueue = [];
      };

      const refreshEndpoint = getRefreshEndpoint(
        url,
        originalRequest.method || "get",
      );

      if (API._isRefreshing) {
        try {
          await enqueue();
          return API(originalRequest);
        } catch (e) {
          return Promise.reject(e);
        }
      }

      API._isRefreshing = true;

      try {
        // Use raw axios to call refresh without triggering this interceptor
        await axios.post(
          refreshEndpoint,
          {},
          { baseURL: API.defaults.baseURL, withCredentials: true },
        );
        processQueue(null);
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        API._isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Bike Booking API
export const createBikeOrder = (bookingData) =>
  API.post("/bike-bookings/create-order", bookingData);

export const verifyBikePayment = (paymentData) =>
  API.post("/bike-bookings/verify-payment", paymentData);

export const getMyBikeBookings = () => API.get("/bike-bookings/my-bookings");

export const getBikeBookingById = (id) => API.get(`/bike-bookings/${id}`);

export const cancelBikeBooking = (id) =>
  API.post(`/bike-bookings/${id}/cancel`);

export const getBikeOwnerBookings = () =>
  API.get("/bike-bookings/owner/bookings");

export const updateBikeBookingStatus = (id, status) =>
  API.patch(`/bike-bookings/owner/${id}/status`, { status });

export default API;
