const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const governmentOfficialSchema = new mongoose.Schema(
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
    contact: {
      type: String,
      required: [true, "Contact is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: ["Tourism", "Police", "Disaster", "Revenue", "Health", "PWD", "Forest"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    serviceNumber: {
      type: String,
      required: [true, "Service/Badge number is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // Government officials are auto-approved for now
    },
  },
  { timestamps: true },
);

// Hash password before saving
governmentOfficialSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
governmentOfficialSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("GovernmentOfficial", governmentOfficialSchema);
