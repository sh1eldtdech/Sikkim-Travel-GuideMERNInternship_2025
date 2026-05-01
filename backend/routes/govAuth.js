const express = require("express");
const jwt = require("jsonwebtoken");
const GovernmentOfficial = require("../models/GovernmentOfficial");
const { loginLimiter, registerLimiter } = require("../middleware/rateLimiter");
const { Joi, validateBody } = require("../middleware/validate");
const {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require("../utils/tokenUtils");
const { protectGovOfficial, revokeToken } = require("../middleware/auth");

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  contact: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required(),
  department: Joi.string()
    .valid("Tourism", "Police", "Disaster", "Revenue", "Health", "PWD", "Forest")
    .required(),
  designation: Joi.string().trim().min(2).max(100).required(),
  serviceNumber: Joi.string().trim().min(2).max(50).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(1).required(),
});

// ── POST /gov/register ──────────────────────────────────────────────
router.post(
  "/register",
  registerLimiter,
  validateBody(registerSchema),
  async (req, res) => {
    try {
      const { name, email, password, contact, department, designation, serviceNumber } = req.body;

      const existing = await GovernmentOfficial.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const official = await GovernmentOfficial.create({
        name,
        email,
        password,
        contact,
        department,
        designation,
        serviceNumber,
      });

      const accessToken = generateAccessToken(official._id, "gov-official");
      const refreshToken = generateRefreshToken(official._id, "gov-official");
      setAuthCookies(res, accessToken, refreshToken);

      res.status(201).json({
        message: "Registration successful.",
        official: {
          _id: official._id,
          name: official.name,
          email: official.email,
          department: official.department,
          designation: official.designation,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during registration. Please try again.",
      });
    }
  },
);

// ── POST /gov/login ──────────────────────────────────────────────────
router.post(
  "/login",
  loginLimiter,
  validateBody(loginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const official = await GovernmentOfficial.findOne({ email });
      if (!official || !(await official.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const accessToken = generateAccessToken(official._id, "gov-official");
      const refreshToken = generateRefreshToken(official._id, "gov-official");
      setAuthCookies(res, accessToken, refreshToken);

      res.json({
        message: "Login successful.",
        official: {
          _id: official._id,
          name: official.name,
          email: official.email,
          department: official.department,
          designation: official.designation,
        },
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during login. Please try again.",
      });
    }
  },
);

// ── POST /gov/refresh ────────────────────────────────────────────────
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

    if (decoded.role !== "gov-official" || decoded.type !== "refresh") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const official = await GovernmentOfficial.findById(decoded.id);
    if (!official) {
      return res.status(401).json({ message: "Official not found" });
    }

    const newAccessToken = generateAccessToken(official._id, "gov-official");
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

// ── POST /gov/logout ─────────────────────────────────────────────────
router.post("/logout", protectGovOfficial, async (req, res) => {
  try {
    if (req.token) await revokeToken(req.token);
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await revokeToken(refreshToken);
    clearAuthCookies(res);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred during logout." });
  }
});

// ── GET /gov/me ──────────────────────────────────────────────────────
router.get("/me", protectGovOfficial, async (req, res) => {
  res.json({ official: req.govOfficial });
});

module.exports = router;
