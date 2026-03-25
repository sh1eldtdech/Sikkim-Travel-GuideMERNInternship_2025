const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protectUser } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /user/register ──────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || typeof name !== "string" || 
        !email || typeof email !== "string" || 
        !password || typeof password !== "string") {
      return res.status(400).json({ message: "Name, email and password are required and must be strings" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /user/login ─────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required and must be valid text" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /user/me ─────────────────────────────────────────────────────
router.get("/me", protectUser, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
