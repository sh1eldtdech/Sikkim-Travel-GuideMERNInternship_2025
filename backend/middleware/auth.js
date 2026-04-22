const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Owner = require("../models/Owner");
const BikeOwner = require("../models/BikeOwner");


// Protect Tourist routes
const protectUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized — no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Access denied — not a user token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// Protect Hotel Owner routes (role must be "owner")
const protectOwner = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized — no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "owner") {
      return res.status(403).json({ message: "Access denied — not a hotel owner token" });
    }

    const owner = await Owner.findById(decoded.id).select("-password");
    if (!owner) {
      return res.status(401).json({ message: "Hotel owner not found" });
    }

    /* BYPASSED ADMIN APPROVAL FOR TESTING
    if (owner.status !== "approved") {
      return res.status(403).json({
        message:
          owner.status === "pending"
            ? "Account pending admin approval"
            : "Account has been rejected",
      });
    }
    */

    req.owner = owner;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// Protect Bike Rental Owner routes (role must be "bike-owner")
// Hotel owner tokens are REJECTED here — separate entity.
const protectBikeOwner = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized — no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "bike-owner") {
      return res.status(403).json({ message: "Access denied — not a bike rental owner token" });
    }

    const bikeOwner = await BikeOwner.findById(decoded.id).select("-password");
    if (!bikeOwner) {
      return res.status(401).json({ message: "Bike rental owner not found" });
    }

    /* Uncomment to enforce admin approval:
    if (bikeOwner.status !== "approved") {
      return res.status(403).json({
        message:
          bikeOwner.status === "pending"
            ? "Account pending admin approval"
            : "Account has been rejected",
      });
    }
    */

    req.bikeOwner = bikeOwner;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// Admin middleware (simple secret header check)
const protectAdmin = (req, res, next) => {
  const adminSecret = req.headers["x-admin-secret"];
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: "Admin access denied" });
  }
  next();
};

module.exports = { protectUser, protectOwner, protectBikeOwner, protectAdmin };
