const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protectUser, revokeToken } = require("../middleware/auth");
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
    .allow("", null)
    .optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(1).required(),
});

// ── POST /user/register ──────────────────────────────────────────────
// Creates user and returns access token in httpOnly cookie
// Rate limited: 3 attempts per hour per IP (Phase 2.4)
router.post(
  "/register",
  registerLimiter,
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
        typeof password !== "string"
      ) {
        return res.status(400).json({
          message: "Name, email and password are required and must be strings",
        });
      }

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await User.create({ name, email, password, phone });

      // Generate tokens (Phase 2: use cookies instead of body)
      const accessToken = generateAccessToken(user._id, "user");
      const refreshToken = generateRefreshToken(user._id, "user");

      // Set httpOnly cookies
      setAuthCookies(res, accessToken, refreshToken);

      // Response does NOT include token (already in secure cookie)
      res.status(201).json({
        message: "Registration successful. Tokens set in secure cookies.",
        user: { _id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during registration. Please try again.",
      });
    }
  },
);

// ── POST /user/login ─────────────────────────────────────────────────
// Authenticates user and returns tokens in httpOnly cookies
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

      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate tokens (Phase 2: use cookies)
      const accessToken = generateAccessToken(user._id, "user");
      const refreshToken = generateRefreshToken(user._id, "user");

      // Set httpOnly cookies
      setAuthCookies(res, accessToken, refreshToken);

      // Response does NOT include token
      res.json({
        message: "Login successful. Tokens set in secure cookies.",
        user: { _id: user._id, name: user.name, email: user.email },
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during login. Please try again.",
      });
    }
  },
);

// ── POST /user/refresh ───────────────────────────────────────────────
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

    if (decoded.role !== "user" || decoded.type !== "refresh") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, "user");

    // Set new access token cookie (refresh token remains valid)
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

// ── POST /user/logout ────────────────────────────────────────────────
// Revokes tokens and clears cookies
router.post("/logout", protectUser, async (req, res) => {
  try {
    // Revoke current access token (add to blacklist)
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

// ── GET /user/me ─────────────────────────────────────────────────────
router.get("/me", protectUser, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
