const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const { protectUser, protectOwner } = require("../middleware/auth");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// USER BOOKING ROUTES
// POST /bookings/create-order
// Step 1: User selects room and dates → backend creates Razorpay order
router.post("/create-order", protectUser, async (req, res) => {
  try {
    const { hotelId, roomId, checkIn, checkOut, guests, specialRequests } = req.body;

    if (!hotelId || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "hotelId, roomId, checkIn, checkOut are required" });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Fetch room and hotel
    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (room.availableRooms < 1) {
      return res.status(400).json({ message: "No rooms available for this type" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel || !hotel.isActive) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Calculate pricing
    const roomPrice = room.minPrice || room.price || 0;
    const subtotal = roomPrice * nights;
    const taxes = Math.round(subtotal * 0.12); // 12% GST
    const totalAmount = subtotal + taxes;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // in paise
      currency: "INR",
      receipt: `sikkim_${Date.now()}`,
      notes: {
        hotelId,
        roomId,
        userId: req.user._id.toString(),
        checkIn,
        checkOut,
      },
    });

    // Create a pending booking record
    const booking = await Booking.create({
      user: req.user._id,
      hotel: hotelId,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: guests || 1,
      specialRequests: specialRequests || "",
      pricePerNight: roomPrice,
      subtotal,
      taxes,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
      status: "upcoming",
      // Snapshot
      hotelName: hotel.name,
      roomType: room.roomType,
      hotelLocation: hotel.location,
      hotelImage: hotel.images?.[0] || "",
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: totalAmount * 100,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
      bookingId: booking._id,
      breakdown: { pricePerNight: roomPrice, nights, subtotal, taxes, totalAmount },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /bookings/verify-payment
// Step 2: After Razorpay payment, verify signature and confirm booking
router.post("/verify-payment", protectUser, async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
      return res.status(400).json({ message: "Payment details missing" });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Mark booking as failed
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "failed" });
      return res.status(400).json({ message: "Payment verification failed — invalid signature" });
    }

    // Update booking to confirmed
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    // Decrement available rooms
    await Room.findByIdAndUpdate(booking.room, {
      $inc: { availableRooms: -1 },
    });

    res.json({
      message: "Payment verified. Booking confirmed!",
      bookingId: booking._id,
      bookingRef: `BKG${booking._id.toString().slice(-8).toUpperCase()}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /bookings/my-bookings
router.get("/my-bookings", protectUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("hotel", "name location images")
      .populate("room", "roomType price")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /bookings/:id/cancel
router.post("/:id/cancel", protectUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Restore available room count
    await Room.findByIdAndUpdate(booking.room, {
      $inc: { availableRooms: 1 },
    });

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// OWNER ROUTES — View bookings for their hotels
// GET /bookings/owner/bookings
router.get("/owner/bookings", protectOwner, async (req, res) => {
  try {
    const Hotel = require("../models/Hotel");

    // Get all hotel IDs owned by this owner
    const hotels = await Hotel.find({ owner: req.owner._id });
    const hotelIds = hotels.map((h) => h._id);

    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate("user", "name email phone")
      .populate("hotel", "name location")
      .populate("room", "roomType price")
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
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        upcoming: bookings.filter((b) => b.status === "upcoming").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
