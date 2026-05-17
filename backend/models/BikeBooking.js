const mongoose = require("mongoose");

const bikeBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },
    bikeOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BikeOwner",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    rentalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    pricingType: {
      type: String,
      enum: ["hourly", "daily"],
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    taxes: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      amount: Number,
      currency: { type: String, default: "INR" },
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      paidAt: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },
    // Snapshots for historical reference
    bikeName: String,
    bikeImage: String,
    ownerName: String,
    ownerContact: String,
    pickupLocation: String,
    bikeCC: Number,
    bikeFeatures: [String],
  },
  { timestamps: true }
);

// Indexes for performance
bikeBookingSchema.index({ user: 1, createdAt: -1 });
bikeBookingSchema.index({ bike: 1, createdAt: -1 });
bikeBookingSchema.index({ bikeOwner: 1, createdAt: -1 });
bikeBookingSchema.index({ paymentStatus: 1 });
bikeBookingSchema.index({ status: 1 });
bikeBookingSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model("BikeBooking", bikeBookingSchema);