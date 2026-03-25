require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Route imports
const userAuthRoutes = require("./routes/userAuth");
const ownerAuthRoutes = require("./routes/ownerAuth");
const hotelRoutes = require("./routes/hotels");
const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve hotel images statically
// Owner docs (/uploads/docs) are removed from static serving to prevent unauthorized access
app.use("/uploads/hotels", express.static(path.join(__dirname, "uploads/hotels")));

// Routes
app.use("/user", userAuthRoutes);        // POST /user/register, /user/login
app.use("/owner", ownerAuthRoutes);      // POST /owner/register, /owner/login
app.use("/hotels", hotelRoutes);         // GET /hotels, GET /hotels/:id, POST /hotels/add, etc.
app.use("/rooms", roomRoutes);           // POST /rooms/add, PUT /rooms/:id
app.use("/bookings", bookingRoutes);     // POST /create-order, /verify-payment, GET /my-bookings
app.use("/admin", adminRoutes);          // Admin: verify owners, view stats

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Sikkim Tourism API running 🏔️" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
