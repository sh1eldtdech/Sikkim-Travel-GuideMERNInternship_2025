const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * BikeOwner — completely separate MongoDB collection from Owner (hotel owners).
 * Collection name: "bikeowners" (Mongoose pluralises automatically).
 */
const bikeOwnerSchema = new mongoose.Schema(
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
      minlength: 6,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    // Registration documents (optional)
    documents: [{ type: String }],
    // Admin approval flow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

bikeOwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

bikeOwnerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("BikeOwner", bikeOwnerSchema);
