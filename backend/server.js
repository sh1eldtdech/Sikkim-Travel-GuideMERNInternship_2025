require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const connectDB = require("./config/db");

// Route imports
const userAuthRoutes = require("./routes/userAuth");
const ownerAuthRoutes = require("./routes/ownerAuth");
const ownerRoutes = require("./routes/owner"); // Owner management routes
const bikeOwnerAuthRoutes = require("./routes/bikeOwnerAuth");
const adminAuthRoutes = require("./routes/adminAuth"); // Admin JWT auth (replaces x-admin-secret)
const hotelRoutes = require("./routes/hotels");
const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
const paymentRoutes = require("./routes/payment"); // Payment and payout routes
const adminRoutes = require("./routes/admin");
const bikeRoutes = require("./routes/bikes");
const govAuthRoutes = require("./routes/govAuth"); // Government official auth
const noticeRoutes = require("./routes/notices"); // Notice board

const app = express();

// Connect MongoDB
connectDB();

// Middleware - Security headers first
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);

// Compression middleware for response compression
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 1024, // Only compress responses larger than 1KB
    level: 6, // Compression level (0-9, 6 is default)
  }),
);

// Cache headers for static assets and API responses
app.use((req, res, next) => {
  // Cache static assets for 1 year
  if (
    req.path.match(/\.(jpg|jpeg|png|gif|webp|avif|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // Cache API responses for 5 minutes (except auth endpoints)
  else if (
    !req.path.match(
      /\/(user|owner|bike-owner|admin-auth|gov)\/(register|login|refresh|logout)/,
    )
  ) {
    res.setHeader("Cache-Control", "public, max-age=300");
  }
  next();
});

const normalizeOrigin = (origin = "") =>
  origin.trim().replace(/\/+$/, "").toLowerCase();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

const isLoopbackOrigin = (origin = "") =>
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0):\d+$/.test(
    normalizeOrigin(origin),
  );

const isAllowedOrigin = (origin = "") => {
  const normalizedOrigin = normalizeOrigin(origin);

  return (
    !origin ||
    allowedOrigins.includes(normalizedOrigin) ||
    isLoopbackOrigin(normalizedOrigin)
  );
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin || "unknown"}`));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie support (for Phase 2 httpOnly token storage)
app.use(cookieParser());

// Images and documents are stored in Cloudinary (do not serve uploads from local disk)

// Routes with rate limiting (Phase 2.4)
app.use("/user", userAuthRoutes); // POST /user/register, /user/login, /user/refresh, /user/logout
app.use("/owner", ownerAuthRoutes); // POST /owner/register, /owner/login, /owner/refresh, /owner/logout (Hotel owners)
app.use("/owner", ownerRoutes); // GET /owner/upi-id, PUT /owner/upi-id, GET /owner/payouts, etc.
app.use("/bike-owner", bikeOwnerAuthRoutes); // POST /bike-owner/register, /bike-owner/login, /bike-owner/refresh, /bike-owner/logout (Bike rental owners)
app.use("/admin-auth", adminAuthRoutes); // Phase 2: POST /admin-auth/login, /admin-auth/refresh, /admin-auth/logout
app.use("/hotels", hotelRoutes); // GET /hotels, GET /hotels/:id, POST /hotels/add, etc.
app.use("/rooms", roomRoutes); // POST /rooms/add, PUT /rooms/:id
app.use("/bookings", bookingRoutes); // POST /create-order, /verify-payment, GET /my-bookings
app.use("/payment", paymentRoutes); // POST /payment/create-order, /payment/verify, /payment/webhook, etc.
app.use("/admin", adminRoutes); // GET /admin/stats, PUT /admin/owners/:id/approve, etc. (requires JWT auth)
app.use("/bikes", bikeRoutes); // GET /bikes, POST /bikes/add, etc.
app.use("/gov", govAuthRoutes); // POST /gov/register, /gov/login, /gov/refresh, /gov/logout, GET /gov/me
app.use("/notices", noticeRoutes); // POST /notices/upload, GET /notices/all, GET /notices/my, DELETE /notices/:id

// Root Route - Welcome Message
app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to Sikkim Travel Guide API! A complete solution for your visit to Sikkim.",
    status: "Active",
    docs: "Please use the frontend client to interact with this API.",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Sikkim Tourism API running 🏔️" });
});

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err); // Log full error server-side
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message || "Invalid upload" });
  }

  if (typeof err.message === "string" && err.message.includes("Only ")) {
    return res.status(400).json({ message: err.message });
  }

  // Return generic message to client (Phase 4 will add structured logging)
  const statusCode = err.status || 500;
  const message =
    statusCode === 404 ? "Not found" : "An error occurred. Please try again.";
  res.status(statusCode).json({ message });
});

// Start server
const DEFAULT_PORT = 5000;
const HAS_EXPLICIT_PORT = Boolean(process.env.PORT);
const START_PORT = Number(process.env.PORT) || DEFAULT_PORT;
const MAX_PORT_RETRIES = Number(process.env.PORT_RETRY_COUNT) || 5;

const startServer = (port, retriesLeft = MAX_PORT_RETRIES) => {
  const server = app.listen(port, () => {
    if (port !== START_PORT) {
      console.warn(
        `Server started on fallback port ${port}. Update VITE_API_BASE_URL if needed.`,
      );
    }
    console.log(`Server running at http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      // In explicit PORT mode (e.g. .env PORT=3000), fail fast so frontend does not call the wrong process.
      if (!HAS_EXPLICIT_PORT && retriesLeft > 0) {
        const nextPort = port + 1;
        console.warn(
          `Port ${port} is already in use. Retrying on ${nextPort} (${retriesLeft} retries left)...`,
        );
        return startServer(nextPort, retriesLeft - 1);
      }

      console.error(
        HAS_EXPLICIT_PORT
          ? `Configured PORT ${START_PORT} is already in use. Stop the conflicting process and restart backend.`
          : `Could not start server. Ports ${START_PORT}-${port} are in use. Set PORT to an available value.`,
      );
      process.exit(1);
    }

    throw err;
  });
};

startServer(START_PORT);
