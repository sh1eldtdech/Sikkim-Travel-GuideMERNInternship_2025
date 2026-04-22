const express = require("express");
const jwt = require("jsonwebtoken");
const BikeOwner = require("../models/BikeOwner");
const { uploadDocs } = require("../middleware/upload");
const { protectBikeOwner } = require("../middleware/auth");

const router = express.Router();

/** Issues a token with role "bike-owner" — distinct from hotel owner tokens */
const generateToken = (id) =>
  jwt.sign({ id, role: "bike-owner" }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /bike-owner/register
router.post("/register", uploadDocs.array("documents", 5), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (
      !name || typeof name !== "string" ||
      !email || typeof email !== "string" ||
      !password || typeof password !== "string" ||
      !phone || typeof phone !== "string"
    ) {
      return res.status(400).json({ message: "All fields are required and must be strings" });
    }

    const existing = await BikeOwner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered as a Bike Rental owner" });
    }

    const documentPaths = req.files ? req.files.map((f) => `/uploads/docs/${f.filename}`) : [];

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
    res.status(500).json({ message: err.message });
  }
});

// POST /bike-owner/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required" });
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

    res.json({
      message: "Login successful",
      token: generateToken(bikeOwner._id),
      bikeOwner: {
        _id: bikeOwner._id,
        name: bikeOwner.name,
        email: bikeOwner.email,
        businessType: "bike-rental",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /bike-owner/me
router.get("/me", protectBikeOwner, async (req, res) => {
  res.json({ bikeOwner: req.bikeOwner });
});

module.exports = router;
