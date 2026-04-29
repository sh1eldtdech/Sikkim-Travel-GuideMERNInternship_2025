const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ── Documents upload — Cloudinary (store as raw files where supported) ──
const docsCloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "sikkim_docs",
    resource_type: "raw",
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    public_id: `doc_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  }),
});

const docsFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else
    cb(
      new Error("Only PDF, JPG, JPEG, PNG files are allowed for documents"),
      false,
    );
};

// ── Hotel images upload — Cloudinary ──
const hotelCloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "sikkim_hotels",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [
      { width: 1200, height: 800, crop: "limit", quality: "auto" },
    ],
    public_id: `hotel_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  }),
});

const imagesFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else
    cb(new Error("Only JPG, JPEG, PNG, WEBP, AVIF images are allowed"), false);
};

const uploadDocs = multer({
  storage: docsCloudinaryStorage,
  fileFilter: docsFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
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
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [
      { width: 1200, height: 800, crop: "limit", quality: "auto" },
    ],
    public_id: `bike_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  }),
});

const uploadBikeImages = multer({
  storage: bikeCloudinaryStorage,
  fileFilter: imagesFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

module.exports = { uploadDocs, uploadImages, uploadBikeImages };
