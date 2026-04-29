const express = require("express");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const { uploadDocs } = require("../middleware/upload");
const { protectOwner, revokeToken } = require("../middleware/auth");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");
const { Joi, validateBody } = require("../middleware/validate");
const {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require("../utils/tokenUtils");

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .required(),
  phone: Joi.string()
    .trim()
    .pattern(/^[+]?[-\d\s]{10,15}$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(1).required(),
});

// POST /owner/register
// Accepts multipart/form-data with document files
// Pending approval by admin - cannot login until approved
// Rate limited: 3 attempts per hour per IP (Phase 2.4)
router.post(
  "/register",
  registerLimiter,
  uploadDocs.array("documents", 5),
  validateBody(registerSchema),
  async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      if (
        !name ||
        typeof name !== "string" ||
        !email ||
        typeof email !== "string" ||
        !password ||
        typeof password !== "string" ||
        !phone ||
        typeof phone !== "string"
      ) {
        return res
          .status(400)
          .json({ message: "All fields are required and must be strings" });
      }

      const existing = await Owner.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Build document URLs/paths from uploaded files (Cloudinary returns secure_url/path)
      const documentPaths = req.files
        ? req.files.map(
            (f) =>
              f.path || f.secure_url || f.url || `/uploads/docs/${f.filename}`,
          )
        : [];

      const owner = await Owner.create({
        name,
        email,
        password,
        phone,
        documents: documentPaths,
        status: "pending", // Must be approved by admin before login
      });

      res.status(201).json({
        message:
          "Registration submitted successfully. You will receive login access after admin verification (24-48 hours).",
        ownerId: owner._id,
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during registration. Please try again.",
      });
    }
  },
);

// POST /owner/login
// Returns tokens in httpOnly cookies (Phase 2)
// Rate limited: 5 attempts per 15 minutes per IP (Phase 2.4)
router.post(
  "/login",
  loginLimiter,
  validateBody(loginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      if (
        !email ||
        typeof email !== "string" ||
        !password ||
        typeof password !== "string"
      ) {
        return res.status(400).json({
          message: "Email and password are required and must be valid text",
        });
      }

      const owner = await Owner.findOne({ email });
      if (!owner || !(await owner.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (owner.status === "rejected") {
        return res.status(403).json({
          message: `Your account has been rejected. Reason: ${owner.rejectionReason || "Contact support"}`,
        });
      }

      // Note: protectOwner middleware enforces status === "approved"
      // but we allow pending status here so they get a clear message
      if (owner.status === "pending") {
        return res.status(403).json({
          message:
            "Your account is still pending admin approval. Please check back in 24-48 hours.",
        });
      }

      // Generate tokens (Phase 2: use cookies)
      const accessToken = generateAccessToken(owner._id, "owner");
      const refreshToken = generateRefreshToken(owner._id, "owner");

      // Set httpOnly cookies
      setAuthCookies(res, accessToken, refreshToken);

      // Response does NOT include token
      res.json({
        message: "Login successful. Tokens set in secure cookies.",
        owner: { _id: owner._id, name: owner.name, email: owner.email },
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during login. Please try again.",
      });
    }
  },
);

// POST /owner/refresh
// Exchanges refresh token for new access token
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    );

    if (decoded.role !== "owner" || decoded.type !== "refresh") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const owner = await Owner.findById(decoded.id);
    if (!owner) {
      return res.status(401).json({ message: "Owner not found" });
    }

    // Verify owner is still approved
    if (owner.status !== "approved") {
      return res.status(403).json({
        message:
          owner.status === "pending"
            ? "Account pending admin approval"
            : "Account has been rejected",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(owner._id, "owner");

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
});

// POST /owner/logout
// Revokes tokens and clears cookies
router.post("/logout", protectOwner, async (req, res) => {
  try {
    // Revoke current access token
    if (req.token) {
      await revokeToken(req.token);
    }

    // Also revoke refresh token if present
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await revokeToken(refreshToken);
    }

    // Clear cookies
    clearAuthCookies(res);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred during logout. Please try again.",
    });
  }
});

// GET /owner/me
router.get("/me", protectOwner, async (req, res) => {
  res.json({ owner: req.owner });
});

module.exports = router;
