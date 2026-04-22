const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ── Documents upload (owner registration) — local disk ──
const docsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/docs";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const docsFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only PDF, JPG, JPEG, PNG files are allowed for documents"), false);
};

// ── Hotel images upload — Cloudinary ──
const hotelCloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "sikkim_hotels",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
    public_id: `hotel_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  }),
});

const imagesFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only JPG, JPEG, PNG, WEBP images are allowed"), false);
};

const uploadDocs = multer({
  storage: docsStorage,
  fileFilter: docsFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadImages = multer({
  storage: hotelCloudinaryStorage,
  fileFilter: imagesFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

// ── Bike images upload — Cloudinary (max 4 images) ──
const bikeCloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "sikkim_bikes",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
    public_id: `bike_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  }),
});

const uploadBikeImages = multer({
  storage: bikeCloudinaryStorage,
  fileFilter: imagesFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

module.exports = { uploadDocs, uploadImages, uploadBikeImages };
