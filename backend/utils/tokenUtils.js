const jwt = require("jsonwebtoken");

/**
 * Generate a short-lived access token (15 minutes)
 * Used for API requests
 */
const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role, type: "access" }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Generate a long-lived refresh token (7 days)
 * Used to refresh expired access tokens
 * Stored in httpOnly cookie
 */
const generateRefreshToken = (id, role) => {
  return jwt.sign(
    { id, role, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

/**
 * Set httpOnly cookies for access and refresh tokens
 * Secure flag only enabled in production (HTTPS)
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";
  // Cookies must be configured to allow cross-site requests from the
  // frontend dev server (different port). In production we require
  // `secure: true` and `sameSite: 'none'`. For local development use
  // `sameSite: 'lax'` so XHR and navigation work without HTTPS.
  const cookieSameSite = isProduction ? "none" : "lax";
  const cookieSecure = isProduction; // true in production (HTTPS)

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

/**
 * Clear auth cookies (for logout)
 */
const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
};
