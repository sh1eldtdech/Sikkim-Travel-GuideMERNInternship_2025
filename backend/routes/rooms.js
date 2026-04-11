const express = require("express");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const { protectOwner } = require("../middleware/auth");

const router = express.Router();

// ── POST /rooms/add ───────────────────────────────────────────────────
router.post("/add", protectOwner, async (req, res) => {
  try {
    const { hotelId, roomType, minPrice, maxPrice, totalRooms, availableRooms, features } = req.body;

    if (!hotelId || !roomType || !minPrice || !maxPrice || !totalRooms || availableRooms === undefined) {
      return res.status(400).json({ message: "hotelId, roomType, minPrice, maxPrice, totalRooms and availableRooms are required" });
    }

    // Verify the hotel belongs to this owner
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    if (hotel.owner.toString() !== req.owner._id.toString()) {
      return res.status(403).json({ message: "Not authorized to add rooms to this hotel" });
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = features.split(",").map((f) => f.trim()).filter(Boolean);
      }
    }

    const room = await Room.create({
      hotel: hotelId,
      roomType,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      totalRooms: Number(totalRooms),
      availableRooms: Number(availableRooms),
      features: parsedFeatures,
    });

    res.status(201).json({ message: "Room added successfully", room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /rooms/:roomId ────────────────────────────────────────────────
// Owner updates price and/or availability
router.put("/:roomId", protectOwner, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId).populate("hotel");
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Check ownership
    if (room.hotel.owner.toString() !== req.owner._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this room" });
    }

    const { minPrice, maxPrice, availableRooms, totalRooms, roomType, features } = req.body;

    if (minPrice !== undefined) room.minPrice = Number(minPrice);
    if (maxPrice !== undefined) room.maxPrice = Number(maxPrice);
    if (availableRooms !== undefined) room.availableRooms = Number(availableRooms);
    if (totalRooms !== undefined) room.totalRooms = Number(totalRooms);
    if (roomType) room.roomType = roomType;
    if (features) {
      try {
        room.features = JSON.parse(features);
      } catch {
        room.features = features.split(",").map((f) => f.trim()).filter(Boolean);
      }
    }

    await room.save();
    res.json({ message: "Room updated successfully", room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /rooms/:roomId ─────────────────────────────────────────────
router.delete("/:roomId", protectOwner, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId).populate("hotel");
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.hotel.owner.toString() !== req.owner._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    room.isActive = false;
    await room.save();

    res.json({ message: "Room removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
