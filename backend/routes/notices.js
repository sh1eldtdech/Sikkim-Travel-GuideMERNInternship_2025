const express = require("express");
const Notice = require("../models/Notice");
const { protectGovOfficial } = require("../middleware/auth");
const { Joi, validateBody } = require("../middleware/validate");
const { uploadDocs } = require("../middleware/upload");

const router = express.Router();

const noticeSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required(),
  content: Joi.string().trim().allow("").optional(),
  category: Joi.string()
    .valid("Landslide", "Flood", "Travel", "Rainfall", "Snowfall", "Earthquake", "Highway", "General")
    .required(),
  severity: Joi.string().valid("Low", "Medium", "High", "Critical").optional(),
  affectedAreas: Joi.string().trim().allow("").optional(),
});

// ── POST /notices/upload ── Upload a notice (gov officials only)
router.post("/upload", protectGovOfficial, uploadDocs.single("file"), validateBody(noticeSchema), async (req, res) => {
  try {
    const { title, content, category, severity, affectedAreas } = req.body;
    const official = req.govOfficial;
    const attachmentUrl = req.file ? req.file.path : null;
    const attachmentType = req.file ? req.file.mimetype : null;
    const attachmentName = req.file ? req.file.originalname : null;

    const notice = await Notice.create({
      title,
      content,
      category,
      severity: severity || "Medium",
      affectedAreas: affectedAreas || "",
      attachmentUrl,
      attachmentType,
      attachmentName,
      uploadedBy: official._id,
      department: official.department,
      officialName: official.name,
    });

    res.status(201).json({
      message: "Notice uploaded successfully.",
      notice,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload notice. Please try again." });
  }
});

// ── GET /notices/my ── Get notices uploaded by the logged-in official
router.get("/my", protectGovOfficial, async (req, res) => {
  try {
    const notices = await Notice.find({ uploadedBy: req.govOfficial._id })
      .sort({ createdAt: -1 });
    res.json({ notices });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notices." });
  }
});

// ── GET /notices/all ── Get all active notices (public - for disaster page)
router.get("/all", async (req, res) => {
  try {
    const now = new Date();
    const notices = await Notice.find({ expiresAt: { $gt: now } })
      .sort({ createdAt: -1 })
      .select("title content category severity affectedAreas department officialName attachmentUrl attachmentType attachmentName createdAt expiresAt");
    res.json({ notices });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notices." });
  }
});

// ── DELETE /notices/:id ── Delete a notice (only by the uploader)
router.delete("/:id", protectGovOfficial, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found." });
    }
    if (notice.uploadedBy.toString() !== req.govOfficial._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own notices." });
    }
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notice." });
  }
});

module.exports = router;
