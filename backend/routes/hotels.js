const express = require("express");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const { protectOwner } = require("../middleware/auth");
const { uploadImages } = require("../middleware/upload");

const router = express.Router();

// ════════════════════════════════════════════════════════════
// PUBLIC ROUTES — Tourists can browse
// ════════════════════════════════════════════════════════════

// ── GET /hotels ──────────────────────────────────────────────────────
// Query params: district, minPrice, maxPrice, search
router.get("/", async (req, res) => {
  try {
    const { district, maxPrice, search } = req.query;

    // Build filter
    const filter = { isActive: true, isApproved: true };
    if (district && typeof district === "string" && district !== "All") filter.district = district;
    if (search && typeof search === "string") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const hotels = await Hotel.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    // Attach rooms and compute starting price for each hotel
    const hotelsWithRooms = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ hotel: hotel._id, isActive: true });

        // Starting price = lowest room minPrice
        const startingPrice =
          rooms.length > 0 ? Math.min(...rooms.map((r) => r.minPrice || r.price || 0)) : 0;
          
        const highestPrice =
          rooms.length > 0 ? Math.max(...rooms.map((r) => r.maxPrice || r.price || 0)) : 0;

        // Filter by maxPrice if provided
        if (maxPrice && startingPrice > Number(maxPrice)) return null;

        return {
          ...hotel.toObject(),
          rooms,
          startingPrice,
          highestPrice,
        };
      })
    );

    // Remove nulls (filtered out by price)
    const result = hotelsWithRooms.filter(Boolean);

    res.json({ count: result.length, hotels: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /hotels/:id ───────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("owner", "name email");
    if (!hotel || !hotel.isActive || !hotel.isApproved) {
      return res.status(404).json({ message: "Hotel not found or pending approval" });
    }

    const rooms = await Room.find({ hotel: hotel._id, isActive: true });

    res.json({ hotel: { ...hotel.toObject(), rooms } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ════════════════════════════════════════════════════════════
// OWNER ROUTES — Protected, only approved owners
// ════════════════════════════════════════════════════════════

// ── POST /hotels/add ─────────────────────────────────────────────────
// Accepts multipart/form-data with hotel images
router.post(
  "/add",
  protectOwner,
  uploadImages.array("images", 6),
  async (req, res) => {
    try {
      const { name, district, location, description, amenities, policies } = req.body;

      if (!name || !district || !location || !description) {
        return res.status(400).json({ message: "Name, district, location and description are required" });
      }

      // Build image paths from Cloudinary URLs
      const imagePaths = req.files
        ? req.files.map((f) => f.path)
        : [];

      // Parse amenities from comma-separated string or JSON array
      let parsedAmenities = [];
      if (amenities) {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch {
          parsedAmenities = amenities.split(",").map((a) => a.trim()).filter(Boolean);
        }
      }

      let parsedPolicies = {};
      if (policies) {
        try {
          parsedPolicies = JSON.parse(policies);
        } catch {
          parsedPolicies = {};
        }
      }

      let parsedPaymentDetails = {};
      if (req.body.paymentDetails) {
        try {
          parsedPaymentDetails = JSON.parse(req.body.paymentDetails);
        } catch {}
      }

      const hotel = await Hotel.create({
        name,
        district,
        location,
        description,
        images: imagePaths,
        amenities: parsedAmenities,
        policies: parsedPolicies,
        paymentDetails: parsedPaymentDetails,
        owner: req.owner._id,
      });

      res.status(201).json({ message: "Hotel added successfully", hotel });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ── PUT /hotels/:id ───────────────────────────────────────────────────
router.put("/:id", protectOwner, uploadImages.array("images", 6), async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Only the hotel's owner can update it
    if (hotel.owner.toString() !== req.owner._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this hotel" });
    }

    const { name, district, location, description, amenities, policies } = req.body;

    if (name) hotel.name = name;
    if (district) hotel.district = district;
    if (location) hotel.location = location;
    if (description) hotel.description = description;

    if (amenities) {
      try {
        hotel.amenities = JSON.parse(amenities);
      } catch {
        hotel.amenities = amenities.split(",").map((a) => a.trim()).filter(Boolean);
      }
    }

    if (policies) {
      try {
        hotel.policies = { ...hotel.policies, ...JSON.parse(policies) };
      } catch {}
    }

    if (req.body.paymentDetails) {
      try {
        hotel.paymentDetails = { ...hotel.paymentDetails, ...JSON.parse(req.body.paymentDetails) };
      } catch {}
    }

    // Append new Cloudinary image URLs if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => f.path);
      hotel.images = [...hotel.images, ...newImages];
    }

    await hotel.save();
    res.json({ message: "Hotel updated", hotel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /hotels/:id ────────────────────────────────────────────────
router.delete("/:id", protectOwner, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    if (hotel.owner.toString() !== req.owner._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Soft delete — keeps data but hides from listings
    hotel.isActive = false;
    await hotel.save();

    res.json({ message: "Hotel removed from listings" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /hotels/owner/my-hotels ───────────────────────────────────────
// Owner gets only their own hotels
router.get("/owner/my-hotels", protectOwner, async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.owner._id }).sort({ createdAt: -1 });

    const hotelsWithRooms = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ hotel: hotel._id });
        return { ...hotel.toObject(), rooms };
      })
    );

    res.json({ hotels: hotelsWithRooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
