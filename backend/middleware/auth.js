const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Owner = require("../models/Owner");
const BikeOwner = require("../models/BikeOwner");
const {
  client: redisClient,
  getKey,
  setKeyWithTTL,
} = require("../config/redis");

/**
 * HELPER: Check if token is revoked (blacklisted)
 * Returns true if token is blacklisted, false otherwise
 */
const isTokenRevoked = async (token) => {
  try {
    // Only check revocation if Redis is connected
    if (!redisClient || !redisClient.connected) return false;

    const result = await getKey(`blacklist:${token}`);
    return result !== null;
  } catch (err) {
    // If Redis fails, allow request (fail open for availability)
    console.warn("Token revocation check failed, allowing request");
    return false;
  }
};

/**
 * HELPER: Extract token from either header or cookie
 * Priority: Cookie > Header (cookies are more secure)
 */
const extractToken = (req) => {
  // Try to get from httpOnly cookie first (Phase 2 pattern)
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) return cookieToken;

  // Fall back to Authorization header (backwards compatibility)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

// Protect Tourist routes
const protectUser = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "Not authorized — no token" });
    }

    // Check if token is revoked
    const revoked = await isTokenRevoked(token);
    if (revoked) {
      return res
        .status(401)
        .json({ message: "Token has been revoked. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res
        .status(403)
        .json({ message: "Access denied — not a user token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.token = token; // Store token for logout
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Protect Hotel Owner routes (role must be "owner")
const protectOwner = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "Not authorized — no token" });
    }

    // Check if token is revoked
    const revoked = await isTokenRevoked(token);
    if (revoked) {
      return res
        .status(401)
        .json({ message: "Token has been revoked. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "owner") {
      return res
        .status(403)
        .json({ message: "Access denied — not a hotel owner token" });
    }

    const owner = await Owner.findById(decoded.id).select("-password");
    if (!owner) {
      return res.status(401).json({ message: "Hotel owner not found" });
    }

    // Enforce hotel owner approval
    if (owner.status !== "approved") {
      return res.status(403).json({
        message:
          owner.status === "pending"
            ? "Account pending admin approval"
            : "Account has been rejected",
      });
    }

    req.owner = owner;
    req.token = token; // Store token for logout
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Protect Bike Rental Owner routes (role must be "bike-owner")
// Hotel owner tokens are REJECTED here — separate entity.
const protectBikeOwner = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "Not authorized — no token" });
    }

    // Check if token is revoked
    const revoked = await isTokenRevoked(token);
    if (revoked) {
      return res
        .status(401)
        .json({ message: "Token has been revoked. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "bike-owner") {
      return res
        .status(403)
        .json({ message: "Access denied — not a bike rental owner token" });
    }

    const bikeOwner = await BikeOwner.findById(decoded.id).select("-password");
    if (!bikeOwner) {
      return res.status(401).json({ message: "Bike rental owner not found" });
    }

    // Enforce bike owner admin approval
    if (bikeOwner.status !== "approved") {
      return res.status(403).json({
        message:
          bikeOwner.status === "pending"
            ? "Account pending admin approval"
            : "Account has been rejected",
      });
    }

    req.bikeOwner = bikeOwner;
    req.token = token; // Store token for logout
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin middleware - Now uses JWT instead of shared secret
const protectAdmin = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized — no admin token" });
    }

    // Check if token is revoked
    const revoked = await isTokenRevoked(token);
    if (revoked) {
      return res
        .status(401)
        .json({ message: "Token has been revoked. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied — not an admin token" });
    }

    // For now, we trust the token. In production, you might verify an admin user in the database
    // Admin creation would be done through secure CLI or trusted process
    req.admin = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};

/**
 * HELPER: Revoke a token by adding it to Redis blacklist
 * Respects token expiration
 */
const revokeToken = async (token) => {
  try {
    if (!redisClient || !redisClient.connected) return;

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return;

    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    if (ttl > 0) {
      await setKeyWithTTL(`blacklist:${token}`, ttl, "revoked");
    }
  } catch (err) {
    console.warn("Failed to revoke token:", err.message);
  }
};

module.exports = {
  protectUser,
  protectOwner,
  protectBikeOwner,
  protectAdmin,
  revokeToken,
  isTokenRevoked,
};
