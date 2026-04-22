const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    // e.g. "Royal Enfield Himalayan 411"
    name: {
      type: String,
      required: [true, "Bike name is required"],
      trim: true,
    },
    // Engine displacement in cc
    cc: {
      type: Number,
      required: [true, "Engine CC is required"],
      min: 50,
    },
    description: {
      type: String,
      default: "",
    },
    // Up to 4 Cloudinary image URLs
    images: [{ type: String }],
    // Pricing
    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      min: 0,
    },
    dailyRate: {
      type: Number,
      required: [true, "Daily rate is required"],
      min: 0,
    },
    // Contact number visible to users
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    // Rental pickup location
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    // District for filtering
    district: {
      type: String,
      enum: ["East", "West", "North", "South", "Other"],
      default: "Other",
    },
    // Features / amenities (helmet, fuel included, etc.)
    features: [{ type: String }],
    // Owner reference
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BikeOwner",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bike", bikeSchema);
