/**
 * Razorpay utility functions for payment integration
 */

/**
 * Load Razorpay script dynamically
 * @returns {Promise<void>}
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
};

/**
 * Check if Razorpay is already loaded
 * @returns {boolean}
 */
export const isRazorpayLoaded = () => {
  return typeof window.Razorpay !== "undefined";
};

/**
 * Create Razorpay order
 * @param {string} bookingId - Booking ID
 * @param {number} amount - Amount in rupees
 * @returns {Promise<object>} - Order details
 */
export const createRazorpayOrder = async (bookingId, amount) => {
  try {
    const response = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        bookingId,
        amount,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create order");
    }

    return await response.json();
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
};

/**
 * Verify Razorpay payment
 * @param {object} paymentDetails - Payment details from Razorpay
 * @returns {Promise<object>} - Verification result
 */
export const verifyRazorpayPayment = async (paymentDetails) => {
  try {
    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(paymentDetails),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Payment verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Verify payment error:", error);
    throw error;
  }
};

/**
 * Get payment status for booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<object>} - Payment status
 */
export const getPaymentStatus = async (bookingId) => {
  try {
    const response = await fetch(`/api/payment/status/${bookingId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get payment status");
    }

    return await response.json();
  } catch (error) {
    console.error("Get payment status error:", error);
    throw error;
  }
};

/**
 * Cancel payment for booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<object>} - Cancellation result
 */
export const cancelPayment = async (bookingId) => {
  try {
    const response = await fetch(`/api/payment/cancel/${bookingId}`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to cancel payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Cancel payment error:", error);
    throw error;
  }
};

/**
 * Format amount for display
 * @param {number} amount - Amount in rupees
 * @returns {string} - Formatted amount string
 */
export const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get payment status color
 * @param {string} status - Payment status
 * @returns {string} - CSS color
 */
export const getPaymentStatusColor = (status) => {
  switch (status) {
    case "paid":
    case "completed":
      return "#10b981"; // green
    case "pending":
      return "#f59e0b"; // amber
    case "failed":
      return "#ef4444"; // red
    case "refunded":
      return "#6b7280"; // gray
    default:
      return "#6b7280"; // gray
  }
};

/**
 * Get payout status color
 * @param {string} status - Payout status
 * @returns {string} - CSS color
 */
export const getPayoutStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "#10b981"; // green
    case "processing":
      return "#3b82f6"; // blue
    case "pending":
      return "#f59e0b"; // amber
    case "failed":
      return "#ef4444"; // red
    case "reversed":
      return "#8b5cf6"; // purple
    default:
      return "#6b7280"; // gray
  }
};