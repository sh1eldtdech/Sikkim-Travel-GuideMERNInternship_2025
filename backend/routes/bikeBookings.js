const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const BikeBooking = require("../models/BikeBooking");
const Bike = require("../models/Bike");
const BikeOwner = require("../models/BikeOwner");
const { protectUser, protectBikeOwner } = require("../middleware/auth");
const { Joi, validateBody } = require("../middleware/validate");

const router = express.Router();

const createOrderSchema = Joi.object({
  bikeId: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
  pricingType: Joi.string().valid("hourly", "daily").required(),
});

const verifyPaymentSchema = Joi.object({
  razorpay_payment_id: Joi.string().required(),
  razorpay_order_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  bookingId: Joi.string().required(),
});

const timingsafeEqualHex = (expected, actual) => {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /bike-bookings/create-order
// Step 1: User selects bike and dates → backend creates Razorpay order
router.post(
  "/create-order",
  protectUser,
  validateBody(createOrderSchema),
  async (req, res) => {
    try {
      const { bikeId, startDate, endDate, pricingType } = req.body;

      // Validate dates
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      if (startDateObj >= endDateObj) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      // Check if start date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDateObj < today) {
        return res
          .status(400)
          .json({ message: "Start date cannot be in the past" });
      }

      // Fetch bike
      const bike = await Bike.findById(bikeId);
      if (!bike || !bike.isActive || !bike.isApproved) {
        return res.status(404).json({ message: "Bike not found or not available" });
      }

      // Calculate rental duration
      let rentalHours = 0;
      let rentalDays = 0;
      
      if (pricingType === "hourly") {
        rentalHours = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60));
        if (rentalHours < 1) {
          return res.status(400).json({ message: "Minimum rental duration is 1 hour" });
        }
      } else {
        rentalDays = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
        if (rentalDays < 1) {
          return res.status(400).json({ message: "Minimum rental duration is 1 day" });
        }
      }

      // Calculate pricing
      let subtotal = 0;
      if (pricingType === "hourly") {
        subtotal = bike.hourlyRate * rentalHours;
      } else {
        subtotal = bike.dailyRate * rentalDays;
      }
      
      const taxes = Math.round(subtotal * 0.12); // 12% GST
      const totalAmount = subtotal + taxes;

      // Check for existing bookings that overlap
      const overlappingBooking = await BikeBooking.findOne({
        bike: bikeId,
        status: { $in: ["upcoming", "active"] },
        $or: [
          { startDate: { $lt: endDateObj }, endDate: { $gt: startDateObj } }
        ]
      });

      if (overlappingBooking) {
        return res.status(400).json({ 
          message: "Bike is not available for the selected dates" 
        });
      }

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // in paise
        currency: "INR",
        receipt: `bike_${Date.now()}`,
        notes: {
          bikeId,
          userId: req.user._id.toString(),
          startDate,
          endDate,
          pricingType,
        },
      });

      // Create a pending booking record
      const booking = await BikeBooking.create({
        user: req.user._id,
        bike: bikeId,
        bikeOwner: bike.owner,
        startDate: startDateObj,
        endDate: endDateObj,
        rentalDays: pricingType === "hourly" ? rentalHours : rentalDays,
        hourlyRate: bike.hourlyRate,
        dailyRate: bike.dailyRate,
        pricingType,
        subtotal,
        taxes,
        totalAmount,
        paymentDetails: {
          razorpayOrderId: razorpayOrder.id,
          amount: totalAmount,
          currency: "INR",
          status: "pending",
        },
        paymentStatus: "pending",
        status: "upcoming",
        // Snapshots
        bikeName: bike.name,
        bikeImage: bike.images?.[0] || "",
        ownerName: bike.owner.name,
        ownerContact: bike.contactNumber,
        pickupLocation: bike.location,
        bikeCC: bike.cc,
        bikeFeatures: bike.features || [],
      });

      res.json({
        orderId: razorpayOrder.id,
        amount: totalAmount * 100,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID,
        bookingId: booking._id,
        breakdown: {
          pricingType,
          rate: pricingType === "hourly" ? bike.hourlyRate : bike.dailyRate,
          duration: pricingType === "hourly" ? rentalHours : rentalDays,
          subtotal,
          taxes,
          totalAmount,
        },
      });
    } catch (err) {
      console.error("Create bike order error:", err);
      res.status(500).json({ message: err.message || "An error occurred. Please try again." });
    }
  }
);

// Step 2: After Razorpay payment, verify signature and confirm booking
router.post(
  "/verify-payment",
  protectUser,
  validateBody(verifyPaymentSchema),
  async (req, res) => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        bookingId,
      } = req.body;

      if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature ||
        !bookingId
      ) {
        return res.status(400).json({ message: "Payment details missing" });
      }

      // Verify Razorpay signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (!timingsafeEqualHex(expectedSignature, razorpay_signature)) {
        await BikeBooking.findByIdAndUpdate(bookingId, { paymentStatus: "failed" });
        return res
          .status(400)
          .json({ message: "Payment verification failed — invalid signature" });
      }

      // Update booking to confirmed
      const booking = await BikeBooking.findById(bookingId);
      if (!booking)
        return res.status(404).json({ message: "Booking not found" });

      // Check idempotency
      if (booking.paymentDetails?.razorpayPaymentId) {
        return res.status(400).json({
          message: "Booking already confirmed. Please contact support if you were charged multiple times.",
        });
      }

      booking.paymentDetails.razorpayPaymentId = razorpay_payment_id;
      booking.paymentDetails.razorpaySignature = razorpay_signature;
      booking.paymentDetails.status = "completed";
      booking.paymentDetails.paidAt = new Date();
      booking.paymentStatus = "paid";
      booking.status = "upcoming";
      await booking.save();

      res.json({
        message: "Payment verified. Booking confirmed!",
        bookingId: booking._id,
        bookingRef: `BBK${booking._id.toString().slice(-8).toUpperCase()}`,
      });
    } catch (err) {
      console.error("Verify bike payment error:", err);
      res.status(500).json({ message: err.message || "An error occurred. Please try again." });
    }
  }
);

// GET /bike-bookings/my-bookings
router.get("/my-bookings", protectUser, async (req, res) => {
  try {
    const bookings = await BikeBooking.find({ user: req.user._id })
      .populate("bike", "name images location")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

// GET /bike-bookings/:id
router.get("/:id", protectUser, async (req, res) => {
  try {
    const booking = await BikeBooking.findById(req.params.id)
      .populate("bike", "name images location features cc")
      .populate("bikeOwner", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

// POST /bike-bookings/:id/cancel
router.post("/:id/cancel", protectUser, async (req, res) => {
  try {
    const booking = await BikeBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "completed" || booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a completed or already cancelled booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// OWNER ROUTES — View bookings for their bikes
// GET /bike-bookings/owner/bookings
router.get("/owner/bookings", protectBikeOwner, async (req, res) => {
  try {
    const bookings = await BikeBooking.find({ bikeOwner: req.bikeOwner._id })
      .populate("user", "name email phone")
      .populate("bike", "name images location")
      .sort({ createdAt: -1 });

    // Dashboard stats
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      bookings,
      stats: {
        totalBookings: bookings.length,
        totalRevenue,
        confirmed: bookings.filter((b) => b.status === "upcoming").length,
        active: bookings.filter((b) => b.status === "active").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

// PATCH /bike-bookings/owner/:id/status - Owner updates booking status
router.patch("/owner/:id/status", protectBikeOwner, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["upcoming", "active", "completed", "cancelled"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await BikeBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.bikeOwner.toString() !== req.bikeOwner._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;