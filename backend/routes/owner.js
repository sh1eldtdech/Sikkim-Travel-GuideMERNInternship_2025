const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");
const PayoutTransaction = require("../models/PayoutTransaction");
const Booking = require("../models/Booking");
const { protectOwner } = require("../middleware/auth");
const { getOwnerPayoutStats } = require("../services/payoutService");

/**
 * @route   PUT /api/owner/upi-id
 * @desc    Update owner's UPI ID for receiving payouts
 * @access  Private (Owner)
 */
router.put("/upi-id", protectOwner, async (req, res) => {
  try {
    const { upiId } = req.body;

    // Validate UPI ID format
    if (!upiId || typeof upiId !== "string") {
      return res.status(400).json({
        message: "UPI ID is required",
      });
    }

    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!upiRegex.test(upiId.trim())) {
      return res.status(400).json({
        message: "Invalid UPI ID format. Example: username@upi or phone@bank",
      });
    }

    // Update owner's UPI ID
    const owner = await Owner.findByIdAndUpdate(
      req.owner._id,
      { upiId: upiId.trim() },
      { new: true }
    );

    res.json({
      success: true,
      message: "UPI ID updated successfully",
      upiId: owner.upiId,
    });
  } catch (error) {
    console.error("Update UPI ID error:", error);
    res.status(500).json({
      message: error.message || "Failed to update UPI ID",
    });
  }
});

/**
 * @route   GET /api/owner/upi-id
 * @desc    Get owner's UPI ID
 * @access  Private (Owner)
 */
router.get("/upi-id", protectOwner, async (req, res) => {
  try {
    const owner = await Owner.findById(req.owner._id).select("upiId");

    res.json({
      success: true,
      upiId: owner.upiId || "",
    });
  } catch (error) {
    console.error("Get UPI ID error:", error);
    res.status(500).json({
      message: error.message || "Failed to get UPI ID",
    });
  }
});

/**
 * @route   GET /api/owner/payouts
 * @desc    Get owner's payout history
 * @access  Private (Owner)
 */
router.get("/payouts", protectOwner, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;

    // Build query
    const query = { ownerId: req.owner._id };
    if (status) {
      query.status = status;
    }

    // Get payouts with pagination
    const payouts = await PayoutTransaction.find(query)
      .populate("bookingId", "checkIn checkOut totalAmount hotelName")
      .populate("hotelId", "name location")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count
    const total = await PayoutTransaction.countDocuments(query);

    res.json({
      success: true,
      payouts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get payouts error:", error);
    res.status(500).json({
      message: error.message || "Failed to get payout history",
    });
  }
});

/**
 * @route   GET /api/owner/payouts/stats
 * @desc    Get owner's payout statistics
 * @access  Private (Owner)
 */
router.get("/payouts/stats", protectOwner, async (req, res) => {
  try {
    const stats = await getOwnerPayoutStats(req.owner._id);

    // Get owner's current payout details
    const owner = await Owner.findById(req.owner._id).select(
      "payoutDetails upiId"
    );

    res.json({
      success: true,
      stats,
      payoutDetails: owner.payoutDetails,
      upiConfigured: !!owner.upiId,
    });
  } catch (error) {
    console.error("Get payout stats error:", error);
    res.status(500).json({
      message: error.message || "Failed to get payout statistics",
    });
  }
});

/**
 * @route   GET /api/owner/payouts/:payoutId
 * @desc    Get details of a specific payout
 * @access  Private (Owner)
 */
router.get("/payouts/:payoutId", protectOwner, async (req, res) => {
  try {
    const { payoutId } = req.params;

    const payout = await PayoutTransaction.findOne({
      _id: payoutId,
      ownerId: req.owner._id,
    })
      .populate("bookingId")
      .populate("hotelId")
      .populate("ownerId", "name email phone");

    if (!payout) {
      return res.status(404).json({
        message: "Payout not found",
      });
    }

    res.json({
      success: true,
      payout,
    });
  } catch (error) {
    console.error("Get payout details error:", error);
    res.status(500).json({
      message: error.message || "Failed to get payout details",
    });
  }
});

/**
 * @route   GET /api/owner/bookings
 * @desc    Get owner's bookings with payment status
 * @access  Private (Owner)
 */
router.get("/bookings", protectOwner, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;

    // Get owner's hotels
    const Hotel = require("../models/Hotel");
    const hotels = await Hotel.find({ ownerId: req.owner._id }).select("_id");
    const hotelIds = hotels.map((h) => h._id);

    // Build query
    const query = { hotel: { $in: hotelIds } };
    if (status) {
      query.status = status;
    }
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Get bookings with pagination
    const bookings = await Booking.find(query)
      .populate("user", "name email phone")
      .populate("hotel", "name location")
      .populate("room", "type pricePerNight")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count
    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      message: error.message || "Failed to get bookings",
    });
  }
});

/**
 * @route   GET /api/owner/dashboard
 * @desc    Get owner's dashboard summary
 * @access  Private (Owner)
 */
router.get("/dashboard", protectOwner, async (req, res) => {
  try {
    // Get owner's hotels
    const Hotel = require("../models/Hotel");
    const hotels = await Hotel.find({ ownerId: req.owner._id }).select("_id");
    const hotelIds = hotels.map((h) => h._id);

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { hotel: { $in: hotelIds } } },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Get payout statistics
    const payoutStats = await PayoutTransaction.aggregate([
      { $match: { ownerId: req.owner._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find({
      hotel: { $in: hotelIds },
    })
      .populate("user", "name email")
      .populate("hotel", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent payouts
    const recentPayouts = await PayoutTransaction.find({
      ownerId: req.owner._id,
    })
      .populate("bookingId", "checkIn totalAmount")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get owner details
    const owner = await Owner.findById(req.owner._id).select(
      "name email upiId payoutDetails"
    );

    res.json({
      success: true,
      dashboard: {
        owner: {
          name: owner.name,
          email: owner.email,
          upiConfigured: !!owner.upiId,
          payoutDetails: owner.payoutDetails,
        },
        bookingStats,
        payoutStats,
        recentBookings,
        recentPayouts,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      message: error.message || "Failed to get dashboard data",
    });
  }
});

/**
 * @route   GET /api/owner/earnings
 * @desc    Get owner's earnings summary
 * @access  Private (Owner)
 */
router.get("/earnings", protectOwner, async (req, res) => {
  try {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 1)); // Default: last month
    const endDate = req.query.endDate
      ? new Date(req.query.endDate)
      : new Date();

    // Get owner's hotels
    const Hotel = require("../models/Hotel");
    const hotels = await Hotel.find({ ownerId: req.owner._id }).select("_id");
    const hotelIds = hotels.map((h) => h._id);

    // Get completed bookings in date range
    const bookings = await Booking.find({
      hotel: { $in: hotelIds },
      paymentStatus: "paid",
      createdAt: { $gte: startDate, $lte: endDate },
    }).select("totalAmount paymentDetails.paidAt");

    // Calculate totals
    const totalEarnings = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    // Get completed payouts in date range
    const payouts = await PayoutTransaction.find({
      ownerId: req.owner._id,
      status: "completed",
      processedAt: { $gte: startDate, $lte: endDate },
    }).select("amount processedAt");

    const totalPayouts = payouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    // Get pending payouts
    const pendingPayouts = await PayoutTransaction.find({
      ownerId: req.owner._id,
      status: { $in: ["pending", "processing"] },
    }).select("amount");

    const totalPending = pendingPayouts.reduce(
      (sum, payout) => sum + payout.amount,
      0
    );

    res.json({
      success: true,
      earnings: {
        period: {
          startDate,
          endDate,
        },
        totalEarnings,
        totalPayouts,
        totalPending,
        pendingPayouts: pendingPayouts.length,
        completedBookings: bookings.length,
        completedPayouts: payouts.length,
      },
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    res.status(500).json({
      message: error.message || "Failed to get earnings data",
    });
  }
});

module.exports = router;