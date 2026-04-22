const express = require("express");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const { uploadDocs } = require("../middleware/upload");
const { protectOwner } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id, role: "owner" }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /owner/register
// Accepts multipart/form-data with document files
router.post("/register", uploadDocs.array("documents", 5), async (req, res) => {
  try {
    console.log("Register incoming body:", req.body);
    const { name, email, password, phone } = req.body;

    if (!name || typeof name !== "string" || 
        !email || typeof email !== "string" || 
        !password || typeof password !== "string" || 
        !phone || typeof phone !== "string") {
      console.log("Missing or invalid field detected.");
      return res.status(400).json({ message: "All fields are required and must be strings" });
    }

    const existing = await Owner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Build document paths from uploaded files
    const documentPaths = req.files
      ? req.files.map((f) => `/uploads/docs/${f.filename}`)
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
    res.status(500).json({ message: err.message });
  }
});

// POST /owner/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required and must be valid text" });
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

    res.json({
      message: "Login successful",
      token: generateToken(owner._id),
      owner: { _id: owner._id, name: owner.name, email: owner.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /owner/me
router.get("/me", protectOwner, async (req, res) => {
  res.json({ owner: req.owner });
});

module.exports = router;
