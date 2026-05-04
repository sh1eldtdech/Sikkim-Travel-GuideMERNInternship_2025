const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ── Documents upload — Cloudinary (store as auto-detected resource type) ──
const docsCloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "sikkim_docs",
    resource_type: "auto",
    allowed_formats: ["pdf", "jpg", "jpeg", "png", "webp"],
    public_id: `doc_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
    // Add transformation to ensure inline viewing for PDFs
    transformation: [
      { flags: "attachment:false" }
    ],
  }),
});

const docsFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else
    cb(
      new Error("Only PDF and image files are allowed for documents"),
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
      { width: 1200, height: 800, crop: "limit", quality: "auto:good", fetch_format: "auto" },
      { quality: "auto:good" }
    ],
    eager: [
      { width: 800, height: 600, crop: "limit", quality: "auto:good", fetch_format: "auto" },
      { width: 400, height: 300, crop: "limit", quality: "auto:good", fetch_format: "auto" }
    ],
    eager_async: true,
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
  limits: { fileSize: 5 * 1024 * 1024 }, // Reduced to 5MB for documents
});

const uploadImages = multer({
  storage: hotelCloudinaryStorage,
  fileFilter: imagesFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Reduced to 5MB for images
});

// ── Bike images upload — Cloudinary (max 4 images) ──
const bikeCloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "sikkim_bikes",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [
      { width: 1200, height: 800, crop: "limit", quality: "auto:good", fetch_format: "auto" },
      { quality: "auto:good" }
    ],
    eager: [
      { width: 800, height: 600, crop: "limit", quality: "auto:good", fetch_format: "auto" },
      { width: 400, height: 300, crop: "limit", quality: "auto:good", fetch_format: "auto" }
    ],
    eager_async: true,
    public_id: `bike_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
  }),
});

const uploadBikeImages = multer({
  storage: bikeCloudinaryStorage,
  fileFilter: imagesFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Reduced to 5MB for images
});

module.exports = { uploadDocs, uploadImages, uploadBikeImages };
