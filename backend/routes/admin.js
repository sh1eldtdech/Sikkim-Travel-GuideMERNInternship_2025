const express = require("express");
const Owner = require("../models/Owner");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const { protectAdmin } = require("../middleware/auth");

const router = express.Router();

// All routes require admin secret header: x-admin-secret

// ── GET /admin/owners ─────────────────────────────────────────────────
router.get("/owners", protectAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const owners = await Owner.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ owners });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /admin/verify-owner/:id ───────────────────────────────────────
router.put("/verify-owner/:id", protectAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }

    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    owner.status = status;
    if (status === "rejected" && rejectionReason) {
      owner.rejectionReason = rejectionReason;
    }
    await owner.save();

    res.json({
      message: `Owner ${status} successfully`,
      owner: { _id: owner._id, name: owner.name, email: owner.email, status: owner.status },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /admin/stats ──────────────────────────────────────────────────
router.get("/stats", protectAdmin, async (req, res) => {
  try {
    const [totalOwners, pendingOwners, totalHotels, totalBookings] = await Promise.all([
      Owner.countDocuments(),
      Owner.countDocuments({ status: "pending" }),
      Hotel.countDocuments({ isActive: true }),
      Booking.countDocuments(),
    ]);

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalOwners,
      pendingOwners,
      totalHotels,
      totalBookings,
      totalRevenue: revenueData[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
