const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      minlength: 10,
      maxlength: 15,
    },
    // Document file paths/URLs uploaded at registration
    documents: [
      {
        type: String, // file path or Cloudinary URL
      },
    ],
    // Admin must approve before owner can login
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    // UPI ID for receiving payouts
    upiId: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          // Allow empty string or validate UPI format
          if (!v || v.trim() === "") return true;
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(v);
        },
        message: "Invalid UPI ID format",
      },
    },
    // Payout tracking details
    payoutDetails: {
      razorpayContactId: {
        type: String,
        default: "",
      },
      razorpayAccountId: {
        type: String,
        default: "",
      },
      payoutEnabled: {
        type: Boolean,
        default: false,
      },
      totalPayouts: {
        type: Number,
        default: 0,
      },
      totalPayoutAmount: {
        type: Number,
        default: 0,
      },
      lastPayoutDate: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

ownerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Database indexes for performance optimization
ownerSchema.index({ email: 1 }); // Already unique, but explicit index helps
ownerSchema.index({ status: 1 });
ownerSchema.index({ createdAt: -1 });
ownerSchema.index({ upiId: 1 }); // Index for UPI-based queries
ownerSchema.index({ "payoutDetails.payoutEnabled": 1 }); // Index for enabled payouts

module.exports = mongoose.model("Owner", ownerSchema);
