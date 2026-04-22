const express = require("express");
const Bike = require("../models/Bike");
const { protectBikeOwner } = require("../middleware/auth");
const { uploadBikeImages } = require("../middleware/upload");

const router = express.Router();


// PUBLIC ROUTES
// GET /bikes  — list all approved + active bikes (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { district, search } = req.query;
    const filter = { isActive: true, isApproved: true };

    if (district && district !== "All") filter.district = district;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const bikes = await Bike.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: bikes.length, bikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /bikes/:id  — single bike detail (public)
router.get("/:id", async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate("owner", "name email");
    if (!bike || !bike.isActive || !bike.isApproved) {
      return res.status(404).json({ message: "Bike not found or pending approval" });
    }
    res.json({ bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// OWNER PROTECTED ROUTES
// GET /bikes/owner/my-bikes  — bike owner's own listings
router.get("/owner/my-bikes", protectBikeOwner, async (req, res) => {
  try {
    const bikes = await Bike.find({ owner: req.bikeOwner._id }).sort({ createdAt: -1 });
    res.json({ bikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /bikes/add  — add a new bike listing (up to 4 images)
router.post("/add", protectBikeOwner, uploadBikeImages.array("images", 4), async (req, res) => {
  try {
    const { name, cc, description, hourlyRate, dailyRate, contactNumber, location, district, features } = req.body;

    if (!name || !cc || !hourlyRate || !dailyRate || !contactNumber || !location) {
      return res.status(400).json({ message: "name, cc, hourlyRate, dailyRate, contactNumber and location are required" });
    }

    const imagePaths = req.files ? req.files.map((f) => f.path) : [];

    let parsedFeatures = [];
    if (features) {
      try { parsedFeatures = JSON.parse(features); }
      catch { parsedFeatures = features.split(",").map((f) => f.trim()).filter(Boolean); }
    }

    const bike = await Bike.create({
      name,
      cc: Number(cc),
      description,
      hourlyRate: Number(hourlyRate),
      dailyRate: Number(dailyRate),
      contactNumber,
      location,
      district: district || "Other",
      features: parsedFeatures,
      images: imagePaths,
      owner: req.bikeOwner._id,
    });

    res.status(201).json({ message: "Bike listed successfully", bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /bikes/:id  — edit a bike listing
router.put("/:id", protectBikeOwner, uploadBikeImages.array("images", 4), async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    if (bike.owner.toString() !== req.bikeOwner._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this bike" });
    }

    const { name, cc, description, hourlyRate, dailyRate, contactNumber, location, district, features } = req.body;

    if (name) bike.name = name;
    if (cc) bike.cc = Number(cc);
    if (description !== undefined) bike.description = description;
    if (hourlyRate) bike.hourlyRate = Number(hourlyRate);
    if (dailyRate) bike.dailyRate = Number(dailyRate);
    if (contactNumber) bike.contactNumber = contactNumber;
    if (location) bike.location = location;
    if (district) bike.district = district;

    if (features) {
      try { bike.features = JSON.parse(features); }
      catch { bike.features = features.split(",").map((f) => f.trim()).filter(Boolean); }
    }

    if (req.files && req.files.length > 0) {
      bike.images = [...bike.images, ...req.files.map((f) => f.path)].slice(0, 4);
    }

    await bike.save();
    res.json({ message: "Bike updated", bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /bikes/:id  — permanently delete a bike listing
router.delete("/:id", protectBikeOwner, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    if (bike.owner.toString() !== req.bikeOwner._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await bike.deleteOne();
    res.json({ message: "Bike deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /bikes/:id/status  — toggle active/inactive
router.patch("/:id/status", protectBikeOwner, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    if (bike.owner.toString() !== req.bikeOwner._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (req.body.isActive !== undefined) {
      bike.isActive = req.body.isActive;
      await bike.save();
    }
    res.json({ message: `Bike ${bike.isActive ? "reactivated" : "deactivated"} successfully`, bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
