const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Verify Razorpay webhook signature
 * @param {string} razorpayOrderId - Razorpay order ID
 * @param {string} razorpayPaymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {boolean} - Whether signature is valid
 */
const verifyWebhookSignature = (razorpayOrderId, razorpayPaymentId, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    return false;
  }
};

/**
 * Verify Razorpay webhook signature for webhook events
 * @param {string} payload - Raw webhook payload
 * @param {string} signature - Webhook signature from headers
 * @returns {boolean} - Whether signature is valid
 */
const verifyWebhookEventSignature = (payload, signature) => {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Webhook event signature verification error:", error);
    return false;
  }
};

/**
 * Create Razorpay order
 * @param {number} amount - Amount in rupees
 * @param {string} receipt - Receipt ID
 * @param {object} notes - Additional notes
 * @returns {Promise<object>} - Razorpay order object
 */
const createOrder = async (amount, receipt, notes = {}) => {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: receipt,
      notes: notes,
    });

    return order;
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw new Error("Failed to create Razorpay order");
  }
};

/**
 * Fetch Razorpay payment details
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<object>} - Payment details
 */
const fetchPayment = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Razorpay payment fetch error:", error);
    throw new Error("Failed to fetch payment details");
  }
};

/**
 * Create Razorpay payout
 * @param {object} payoutData - Payout data
 * @returns {Promise<object>} - Payout details
 */
const createPayout = async (payoutData) => {
  try {
    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
      fund_account: {
        account_type: "vpa",
        vpa: {
          address: payoutData.upiId,
        },
        name: payoutData.name,
      },
      amount: payoutData.amount * 100, // Convert to paise
      currency: "INR",
      mode: payoutData.mode || "IMPS",
      purpose: "payout",
      reference_id: payoutData.referenceId,
      notes: payoutData.notes || {},
    });

    return payout;
  } catch (error) {
    console.error("Razorpay payout creation error:", error);
    throw new Error("Failed to create payout");
  }
};

/**
 * Fetch Razorpay payout details
 * @param {string} payoutId - Razorpay payout ID
 * @returns {Promise<object>} - Payout details
 */
const fetchPayout = async (payoutId) => {
  try {
    const payout = await razorpay.payouts.fetch(payoutId);
    return payout;
  } catch (error) {
    console.error("Razorpay payout fetch error:", error);
    throw new Error("Failed to fetch payout details");
  }
};

module.exports = {
  razorpay,
  verifyWebhookSignature,
  verifyWebhookEventSignature,
  createOrder,
  fetchPayment,
  createPayout,
  fetchPayout,
};