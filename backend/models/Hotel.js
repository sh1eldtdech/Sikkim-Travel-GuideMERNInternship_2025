const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      enum: ["East", "West", "North", "South"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    // Array of image URLs (Cloudinary or local uploads)
    images: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    policies: {
      checkIn: { type: String, default: "2:00 PM" },
      checkOut: { type: String, default: "11:00 AM" },
      cancellation: { type: String, default: "Free cancellation up to 48 hours before check-in" },
      children: { type: String, default: "Children above 5 years welcome" },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // Reference to the Owner who added this hotel
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
