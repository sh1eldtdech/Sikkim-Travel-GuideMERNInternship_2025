const express = require("express");
const jwt = require("jsonwebtoken");
const BikeOwner = require("../models/BikeOwner");
const { uploadDocs } = require("../middleware/upload");
const { protectBikeOwner, revokeToken } = require("../middleware/auth");
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

// POST /bike-owner/register
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

      const existing = await BikeOwner.findOne({ email });
      if (existing) {
        return res.status(400).json({
          message: "Email already registered as a Bike Rental owner",
        });
      }

      const documentPaths = req.files
        ? req.files.map(
            (f) =>
              f.path || f.secure_url || f.url || `/uploads/docs/${f.filename}`,
          )
        : [];

      const bikeOwner = await BikeOwner.create({
        name,
        email,
        password,
        phone,
        documents: documentPaths,
        status: "pending",
      });

      res.status(201).json({
        message:
          "Bike Rental registration submitted. You will receive access after admin verification (24-48 hours).",
        bikeOwnerId: bikeOwner._id,
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during registration. Please try again.",
      });
    }
  },
);

// POST /bike-owner/login
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
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const bikeOwner = await BikeOwner.findOne({ email });
      if (!bikeOwner || !(await bikeOwner.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (bikeOwner.status === "rejected") {
        return res.status(403).json({
          message: `Your account has been rejected. Reason: ${bikeOwner.rejectionReason || "Contact support"}`,
        });
      }

      if (bikeOwner.status === "pending") {
        return res.status(403).json({
          message:
            "Your account is still pending admin approval. Please check back in 24-48 hours.",
        });
      }

      // Generate tokens (Phase 2: use cookies)
      const accessToken = generateAccessToken(bikeOwner._id, "bike-owner");
      const refreshToken = generateRefreshToken(bikeOwner._id, "bike-owner");

      // Set httpOnly cookies
      setAuthCookies(res, accessToken, refreshToken);

      // Response does NOT include token
      res.json({
        message: "Login successful. Tokens set in secure cookies.",
        bikeOwner: {
          _id: bikeOwner._id,
          name: bikeOwner.name,
          email: bikeOwner.email,
          businessType: "bike-rental",
        },
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during login. Please try again.",
      });
    }
  },
);

// POST /bike-owner/refresh
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

    if (decoded.role !== "bike-owner" || decoded.type !== "refresh") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const bikeOwner = await BikeOwner.findById(decoded.id);
    if (!bikeOwner) {
      return res.status(401).json({ message: "Bike owner not found" });
    }

    // Verify bike owner is still approved
    if (bikeOwner.status !== "approved") {
      return res.status(403).json({
        message:
          bikeOwner.status === "pending"
            ? "Account pending admin approval"
            : "Account has been rejected",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(bikeOwner._id, "bike-owner");

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

// POST /bike-owner/logout
// Revokes tokens and clears cookies
router.post("/logout", protectBikeOwner, async (req, res) => {
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

// GET /bike-owner/me
router.get("/me", protectBikeOwner, async (req, res) => {
  res.json({ bikeOwner: req.bikeOwner });
});

module.exports = router;
