const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Landslide", "Flood", "Travel", "Rainfall", "Snowfall", "Earthquake", "Highway", "General"],
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    affectedAreas: {
      type: String,
      trim: true,
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GovernmentOfficial",
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    officialName: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  },
  { timestamps: true },
);

// MongoDB TTL index — auto-delete documents 30 days after upload
noticeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for days remaining
noticeSchema.virtual("daysRemaining").get(function () {
  const now = new Date();
  const diff = this.expiresAt - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Virtual for isActive
noticeSchema.virtual("isActive").get(function () {
  return new Date() < this.expiresAt;
});

noticeSchema.set("toJSON", { virtuals: true });
noticeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Notice", noticeSchema);
