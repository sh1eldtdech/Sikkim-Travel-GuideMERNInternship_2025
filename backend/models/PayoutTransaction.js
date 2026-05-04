const mongoose = require("mongoose");

const payoutTransactionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    razorpayPayoutId: {
      type: String,
      unique: true,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    upiId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "reversed"],
      default: "pending",
    },
    mode: {
      type: String,
      default: "IMPS", // Instant transfer
    },
    processedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
    utr: {
      type: String, // Unique Transaction Reference from bank
    },
    webhookReceived: {
      type: Boolean,
      default: false,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Database indexes for performance optimization
payoutTransactionSchema.index({ ownerId: 1, status: 1 });
payoutTransactionSchema.index({ status: 1, createdAt: 1 });
payoutTransactionSchema.index({ razorpayPayoutId: 1 });
payoutTransactionSchema.index({ bookingId: 1 });
payoutTransactionSchema.index({ upiId: 1 });
payoutTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("PayoutTransaction", payoutTransactionSchema);