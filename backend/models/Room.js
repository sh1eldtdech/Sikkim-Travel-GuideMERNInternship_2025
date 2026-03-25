const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomType: {
      type: String,
      required: [true, "Room type is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price per night is required"],
      min: 0,
    },
    // Total physical rooms of this type in the hotel
    totalRooms: {
      type: Number,
      required: [true, "Total rooms count is required"],
      min: 1,
    },
    // Currently available (not booked) rooms
    availableRooms: {
      type: Number,
      required: [true, "Available rooms count is required"],
      min: 0,
    },
    features: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure availableRooms never exceeds totalRooms
roomSchema.pre("save", function (next) {
  if (this.availableRooms > this.totalRooms) {
    this.availableRooms = this.totalRooms;
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);
