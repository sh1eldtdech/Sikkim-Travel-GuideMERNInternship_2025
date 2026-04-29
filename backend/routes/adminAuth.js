const express = require("express");
const jwt = require("jsonwebtoken");
const { protectAdmin, revokeToken } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");
const { Joi, validateBody } = require("../middleware/validate");
const {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require("../utils/tokenUtils");

const router = express.Router();

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(1).required(),
});

/**
 * IMPORTANT: Admin accounts are created through secure backend processes ONLY.
 * There is NO public registration endpoint for admins.
 *
 * To create an admin account:
 * 1. Use a secure CLI tool or database admin interface
 * 2. Create a user document with role: "admin"
 * 3. Example: In MongoDB directly (or via secure script):
 *    db.users.insertOne({ email: "admin@example.com", password: hashed, role: "admin" })
 *
 * The login endpoint expects an admin account to already exist.
 */

// POST /admin/login
// Admin login using JWT tokens (Phase 2 - replaces x-admin-secret)
// Rate limited: 5 attempts per 15 minutes (Phase 2.4)
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
          message: "Email and password are required",
        });
      }

      // NOTE: In a production system, you would fetch the admin user from database
      // For now, we'll verify against hardcoded credentials for demonstration
      // IMPORTANT: Store admin credentials securely!

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        return res.status(500).json({
          message:
            "Admin credentials not configured. Contact system administrator.",
        });
      }

      if (email !== adminEmail || password !== adminPassword) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      // Generate tokens (Phase 2: use cookies)
      const accessToken = generateAccessToken(email, "admin");
      const refreshToken = generateRefreshToken(email, "admin");

      // Set httpOnly cookies
      setAuthCookies(res, accessToken, refreshToken);

      // Response does NOT include token
      res.json({
        message: "Admin login successful. Tokens set in secure cookies.",
        admin: { email },
      });
    } catch (err) {
      res.status(500).json({
        message: "An error occurred during login. Please try again.",
      });
    }
  },
);

// POST /admin/refresh
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

    if (decoded.role !== "admin" || decoded.type !== "refresh") {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.id, "admin");

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

// POST /admin/logout
// Revokes tokens and clears cookies
router.post("/logout", protectAdmin, async (req, res) => {
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

    res.json({ message: "Admin logged out successfully" });
  } catch (err) {
    res.status(500).json({
      message: "An error occurred during logout. Please try again.",
    });
  }
});

module.exports = router;
