const express = require("express");
const Owner = require("../models/Owner");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const BikeOwner = require("../models/BikeOwner");
const Bike = require("../models/Bike");
const { protectAdmin } = require("../middleware/auth");

const router = express.Router();

// All routes are protected with the x-admin-secret header.
// This file is intentionally structured per business entity so new business
// types (e.g. Trekking, Homestay) can be plugged in by adding a new block.

// UNIFIED STATS  —  GET /admin/stats
// Returns aggregated numbers for every business entity.

router.get("/stats", protectAdmin, async (req, res) => {
  try {
    const [
      totalHotelOwners,
      pendingHotelOwners,
      totalBikeOwners,
      pendingBikeOwners,
      totalHotels,
      pendingHotels,
      totalBikes,
      pendingBikes,
      totalBookings,
    ] = await Promise.all([
      Owner.countDocuments(),
      Owner.countDocuments({ status: "pending" }),
      BikeOwner.countDocuments(),
      BikeOwner.countDocuments({ status: "pending" }),
      Hotel.countDocuments({ isActive: true }),
      Hotel.countDocuments({ isActive: true, isApproved: false }),
      Bike.countDocuments({ isActive: true }),
      Bike.countDocuments({ isActive: true, isApproved: false }),
      Booking.countDocuments(),
    ]);

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      // Hotel entity
      totalHotelOwners,
      pendingHotelOwners,
      totalHotels,
      pendingHotels,
      // Bike rental entity
      totalBikeOwners,
      pendingBikeOwners,
      totalBikes,
      pendingBikes,
      // Shared
      totalBookings,
      totalRevenue: revenueData[0]?.total || 0,
      // Convenience: total pending across all entities
      totalPendingListings: pendingHotels + pendingBikes,
      totalPendingOwners: pendingHotelOwners + pendingBikeOwners,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// HOTEL OWNER MANAGEMENT

// GET /admin/owners  — list hotel owners (filter by ?status=pending|approved|rejected)
router.get("/owners", protectAdmin, async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const owners = await Owner.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ count: owners.length, owners });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /admin/verify-owner/:id  — approve or reject a hotel owner account
router.put("/verify-owner/:id", protectAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ message: "Hotel owner not found" });
    owner.status = status;
    if (status === "rejected" && rejectionReason) owner.rejectionReason = rejectionReason;
    await owner.save();
    res.json({
      message: `Hotel owner ${status} successfully`,
      owner: { _id: owner._id, name: owner.name, email: owner.email, status: owner.status },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// HOTEL LISTING MANAGEMENT

// GET /admin/hotels/pending  — hotels awaiting approval
router.get("/hotels/pending", protectAdmin, async (req, res) => {
  try {
    const hotels = await Hotel.find({ isApproved: false, isActive: true })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ count: hotels.length, hotels });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/hotels  — all hotels (with optional ?status=approved|pending)
router.get("/hotels", protectAdmin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status === "pending") { filter.isApproved = false; filter.isActive = true; }
    if (req.query.status === "approved") { filter.isApproved = true; }
    const hotels = await Hotel.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.json({ count: hotels.length, hotels });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /admin/hotels/:id/approve
router.patch("/hotels/:id/approve", protectAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    hotel.isApproved = true;
    await hotel.save();
    res.json({ message: "Hotel approved successfully", hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /admin/hotels/:id/reject
router.patch("/hotels/:id/reject", protectAdmin, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    hotel.isActive = false;
    hotel.isApproved = false;
    await hotel.save();
    res.json({ message: "Hotel rejected successfully", hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BIKE OWNER MANAGEMENT

// GET /admin/bike-owners  — list bike rental owners (filter by ?status=...)
router.get("/bike-owners", protectAdmin, async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const bikeOwners = await BikeOwner.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ count: bikeOwners.length, bikeOwners });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /admin/verify-bike-owner/:id  — approve or reject a bike rental owner account
router.put("/verify-bike-owner/:id", protectAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
    }
    const bikeOwner = await BikeOwner.findById(req.params.id);
    if (!bikeOwner) return res.status(404).json({ message: "Bike rental owner not found" });
    bikeOwner.status = status;
    if (status === "rejected" && rejectionReason) bikeOwner.rejectionReason = rejectionReason;
    await bikeOwner.save();
    res.json({
      message: `Bike rental owner ${status} successfully`,
      bikeOwner: { _id: bikeOwner._id, name: bikeOwner.name, email: bikeOwner.email, status: bikeOwner.status },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BIKE LISTING MANAGEMENT

// GET /admin/bikes/pending  — bikes awaiting approval
router.get("/bikes/pending", protectAdmin, async (req, res) => {
  try {
    const bikes = await Bike.find({ isApproved: false, isActive: true })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ count: bikes.length, bikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/bikes  — all bikes (with optional ?status=approved|pending)
router.get("/bikes", protectAdmin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status === "pending") { filter.isApproved = false; filter.isActive = true; }
    if (req.query.status === "approved") { filter.isApproved = true; }
    const bikes = await Bike.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.json({ count: bikes.length, bikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /admin/bikes/:id/approve
router.patch("/bikes/:id/approve", protectAdmin, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    bike.isApproved = true;
    await bike.save();
    res.json({ message: "Bike approved successfully", bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /admin/bikes/:id/reject
router.patch("/bikes/:id/reject", protectAdmin, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    bike.isActive = false;
    bike.isApproved = false;
    await bike.save();
    res.json({ message: "Bike rejected successfully", bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// TEMPLATE: Add new business type below following the same pattern
// Example for a future "Trekking Guide" entity:
// GET    /admin/trekking-guides          — list all
// PUT    /admin/verify-trekking-guide/:id — approve / reject owner
// GET    /admin/treks/pending            — listings
// PATCH  /admin/treks/:id/approve
// PATCH  /admin/treks/:id/reject

module.exports = router;
