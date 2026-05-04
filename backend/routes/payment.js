const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const {
  razorpay,
  verifyWebhookSignature,
  verifyWebhookEventSignature,
  createOrder,
  fetchPayment,
} = require("../config/razorpay");
const Booking = require("../models/Booking");
const Owner = require("../models/Owner");
const { protectUser } = require("../middleware/auth");
const {
  triggerPayout,
  handlePaymentCaptured,
  handlePayoutProcessed,
  handlePayoutFailed,
} = require("../services/payoutService");

/**
 * @route   POST /api/payment/create-order
 * @desc    Create Razorpay order for booking
 * @access  Private (User)
 */
router.post("/create-order", protectUser, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // Validate input
    if (!bookingId || !amount) {
      return res.status(400).json({
        message: "Booking ID and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Verify booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access to this booking",
      });
    }

    // Check if payment already completed
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Payment already completed for this booking",
      });
    }

    // Create Razorpay order
    const order = await createOrder(amount, bookingId, {
      bookingId: bookingId,
      userId: req.user._id.toString(),
      hotelId: booking.hotel.toString(),
      userName: req.user.name,
      userEmail: req.user.email,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: bookingId,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: error.message || "Failed to create payment order",
    });
  }
});

/**
 * @route   POST /api/payment/verify
 * @desc    Verify payment and update booking
 * @access  Private (User)
 */
router.post("/verify", protectUser, async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      bookingId,
    } = req.body;

    // Validate input
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !bookingId) {
      return res.status(400).json({
        message: "All payment details are required",
      });
    }

    // Verify signature
    const isValid = verifyWebhookSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Verify booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access to this booking",
      });
    }

    // Fetch payment details from Razorpay
    const payment = await fetchPayment(razorpayPaymentId);

    // Verify payment amount matches booking
    const expectedAmount = booking.totalAmount * 100; // Convert to paise
    if (payment.amount !== expectedAmount) {
      return res.status(400).json({
        message: "Payment amount does not match booking amount",
      });
    }

    // Update booking payment details
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        "paymentDetails.razorpayOrderId": razorpayOrderId,
        "paymentDetails.razorpayPaymentId": razorpayPaymentId,
        "paymentDetails.razorpaySignature": razorpaySignature,
        "paymentDetails.amount": payment.amount / 100, // Convert to rupees
        "paymentDetails.currency": payment.currency,
        "paymentDetails.status": "completed",
        "paymentDetails.paidAt": new Date(),
        paymentStatus: "paid",
      },
      { new: true }
    );

    // Trigger payout (will be processed by background job)
    try {
      await triggerPayout(bookingId);
    } catch (payoutError) {
      console.error("Payout trigger error:", payoutError);
      // Don't fail payment verification if payout fails
      // Payout will be retried automatically
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      message: error.message || "Payment verification failed",
    });
  }
});

/**
 * @route   POST /api/payment/webhook
 * @desc    Razorpay webhook endpoint for payment and payout events
 * @access  Public
 */
router.post("/webhook", async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({
        message: "Webhook signature missing",
      });
    }

    // Verify webhook signature
    const payload = JSON.stringify(req.body);
    const isValid = verifyWebhookEventSignature(payload, signature);

    if (!isValid) {
      console.error("Invalid webhook signature received");
      return res.status(400).json({
        message: "Invalid webhook signature",
      });
    }

    const event = req.body;
    const { event: eventType, payload: eventPayload } = event;

    console.log(`Webhook received: ${eventType}`);

    // Handle different webhook events
    switch (eventType) {
      case "payment.captured":
        await handlePaymentCaptured(eventPayload.payment);
        break;

      case "payment.failed":
        console.log("Payment failed:", eventPayload.payment);
        // Update booking payment status
        if (eventPayload.payment?.notes?.bookingId) {
          await Booking.findByIdAndUpdate(
            eventPayload.payment.notes.bookingId,
            {
              "paymentDetails.status": "failed",
              paymentStatus: "failed",
            }
          );
        }
        break;

      case "payout.processed":
        await handlePayoutProcessed(eventPayload.payout);
        break;

      case "payout.failed":
        await handlePayoutFailed(eventPayload.payout);
        break;

      case "payout.reversed":
        console.log("Payout reversed:", eventPayload.payout);
        // Handle payout reversal if needed
        break;

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    res.json({
      status: "ok",
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({
      message: error.message || "Webhook processing failed",
    });
  }
});

/**
 * @route   GET /api/payment/status/:bookingId
 * @desc    Get payment status for a booking
 * @access  Private (User)
 */
router.get("/status/:bookingId", protectUser, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Verify booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access to this booking",
      });
    }

    res.json({
      success: true,
      paymentStatus: booking.paymentStatus,
      paymentDetails: booking.paymentDetails,
      payoutDetails: booking.payoutDetails,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      message: error.message || "Failed to get payment status",
    });
  }
});

/**
 * @route   POST /api/payment/cancel/:bookingId
 * @desc    Cancel payment for a booking (before completion)
 * @access  Private (User)
 */
router.post("/cancel/:bookingId", protectUser, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Verify booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access to this booking",
      });
    }

    // Can only cancel pending payments
    if (booking.paymentStatus !== "pending") {
      return res.status(400).json({
        message: `Cannot cancel payment with status: ${booking.paymentStatus}`,
      });
    }

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, {
      status: "cancelled",
      "paymentDetails.status": "failed",
      paymentStatus: "failed",
    });

    res.json({
      success: true,
      message: "Payment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel payment error:", error);
    res.status(500).json({
      message: error.message || "Failed to cancel payment",
    });
  }
});

module.exports = router;