const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Owner = require("../models/Owner");
const PayoutTransaction = require("../models/PayoutTransaction");
const { createPayout, fetchPayout } = require("../config/razorpay");

/**
 * Trigger payout for a completed booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<object>} - Payout transaction details
 */
const triggerPayout = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate("ownerId")
      .populate("hotelId");

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.paymentDetails.status !== "completed") {
      throw new Error("Payment not completed for this booking");
    }

    const owner = booking.ownerId;
    if (!owner.upiId) {
      throw new Error("Owner UPI ID not configured");
    }

    // Check if payout already exists for this booking
    const existingPayout = await PayoutTransaction.findOne({ bookingId });
    if (existingPayout) {
      console.log(`Payout already exists for booking ${bookingId}`);
      return existingPayout;
    }

    // Create payout transaction record
    const payoutTransaction = new PayoutTransaction({
      bookingId: booking._id,
      ownerId: owner._id,
      hotelId: booking.hotelId._id,
      amount: booking.paymentDetails.amount,
      upiId: owner.upiId,
      status: "pending",
      notes: {
        bookingId: booking._id.toString(),
        hotelName: booking.hotelId.name,
        guestName: booking.user?.name || "Guest",
      },
    });

    await payoutTransaction.save();

    // Process payout
    await processPayout(payoutTransaction._id);

    return payoutTransaction;
  } catch (error) {
    console.error("Payout trigger error:", error);
    throw error;
  }
};

/**
 * Process individual payout
 * @param {string} payoutTransactionId - Payout transaction ID
 * @returns {Promise<object>} - Payout details
 */
const processPayout = async (payoutTransactionId) => {
  try {
    const payoutTransaction = await PayoutTransaction.findById(
      payoutTransactionId
    );

    if (!payoutTransaction) {
      throw new Error("Payout transaction not found");
    }

    if (payoutTransaction.status !== "pending") {
      console.log(
        `Payout ${payoutTransactionId} already processed with status: ${payoutTransaction.status}`
      );
      return payoutTransaction;
    }

    // Update status to processing
    payoutTransaction.status = "processing";
    await payoutTransaction.save();

    // Get owner details
    const owner = await Owner.findById(payoutTransaction.ownerId);
    if (!owner) {
      throw new Error("Owner not found");
    }

    // Create Razorpay payout
    const payout = await createPayout({
      upiId: payoutTransaction.upiId,
      name: owner.name,
      amount: payoutTransaction.amount,
      referenceId: payoutTransaction._id.toString(),
      notes: payoutTransaction.notes,
    });

    // Update payout transaction
    payoutTransaction.razorpayPayoutId = payout.id;
    payoutTransaction.status = "processing";
    await payoutTransaction.save();

    // Update booking payout details
    await Booking.findByIdAndUpdate(payoutTransaction.bookingId, {
      "payoutDetails.razorpayPayoutId": payout.id,
      "payoutDetails.amount": payoutTransaction.amount,
      "payoutDetails.status": "processing",
    });

    console.log(`Payout created successfully: ${payout.id}`);
    return payout;
  } catch (error) {
    console.error("Payout processing error:", error);

    // Update transaction as failed
    if (payoutTransactionId) {
      await PayoutTransaction.findByIdAndUpdate(payoutTransactionId, {
        status: "failed",
        failureReason: error.message,
        retryCount: 1,
      });
    }

    throw error;
  }
};

/**
 * Handle payment captured webhook event
 * @param {object} payment - Razorpay payment object
 * @returns {Promise<void>}
 */
const handlePaymentCaptured = async (payment) => {
  try {
    const bookingId = payment.notes?.bookingId;

    if (!bookingId) {
      console.log("No booking ID in payment notes");
      return;
    }

    // Update booking payment details
    await Booking.findByIdAndUpdate(bookingId, {
      "paymentDetails.razorpayPaymentId": payment.id,
      "paymentDetails.amount": payment.amount / 100, // Convert from paise
      "paymentDetails.status": "completed",
      "paymentDetails.paidAt": new Date(),
      paymentStatus: "paid",
    });

    console.log(`Payment captured for booking ${bookingId}`);

    // Trigger payout
    await triggerPayout(bookingId);
  } catch (error) {
    console.error("Payment captured webhook error:", error);
  }
};

/**
 * Handle payout processed webhook event
 * @param {object} payout - Razorpay payout object
 * @returns {Promise<void>}
 */
const handlePayoutProcessed = async (payout) => {
  try {
    const payoutTransactionId = payout.notes?.payoutTransactionId;

    if (!payoutTransactionId) {
      console.log("No payout transaction ID in payout notes");
      return;
    }

    // Update payout transaction
    await PayoutTransaction.findByIdAndUpdate(payoutTransactionId, {
      status: "completed",
      processedAt: new Date(),
      utr: payout.utr,
      webhookReceived: true,
    });

    // Update booking payout details
    await Booking.findOneAndUpdate(
      { "payoutDetails.razorpayPayoutId": payout.id },
      {
        "payoutDetails.status": "completed",
        "payoutDetails.processedAt": new Date(),
      }
    );

    // Update owner stats
    const payoutTransaction = await PayoutTransaction.findById(
      payoutTransactionId
    );
    if (payoutTransaction) {
      await Owner.findByIdAndUpdate(payoutTransaction.ownerId, {
        $inc: {
          "payoutDetails.totalPayouts": 1,
          "payoutDetails.totalPayoutAmount": payoutTransaction.amount,
        },
        "payoutDetails.lastPayoutDate": new Date(),
      });
    }

    console.log(`Payout processed successfully: ${payout.id}`);
  } catch (error) {
    console.error("Payout processed webhook error:", error);
  }
};

/**
 * Handle payout failed webhook event
 * @param {object} payout - Razorpay payout object
 * @returns {Promise<void>}
 */
const handlePayoutFailed = async (payout) => {
  try {
    const payoutTransactionId = payout.notes?.payoutTransactionId;

    if (!payoutTransactionId) {
      console.log("No payout transaction ID in payout notes");
      return;
    }

    // Update payout transaction
    await PayoutTransaction.findByIdAndUpdate(payoutTransactionId, {
      status: "failed",
      failureReason: payout.failure_reason || "Unknown error",
      webhookReceived: true,
    });

    // Update booking payout details
    await Booking.findOneAndUpdate(
      { "payoutDetails.razorpayPayoutId": payout.id },
      {
        "payoutDetails.status": "failed",
        "payoutDetails.failureReason": payout.failure_reason,
      }
    );

    console.log(`Payout failed: ${payout.id} - ${payout.failure_reason}`);

    // Schedule retry
    await schedulePayoutRetry(payoutTransactionId);
  } catch (error) {
    console.error("Payout failed webhook error:", error);
  }
};

/**
 * Schedule payout retry
 * @param {string} payoutTransactionId - Payout transaction ID
 * @returns {Promise<void>}
 */
const schedulePayoutRetry = async (payoutTransactionId) => {
  try {
    const payoutTransaction = await PayoutTransaction.findById(
      payoutTransactionId
    );

    if (!payoutTransaction) {
      return;
    }

    if (payoutTransaction.retryCount >= 3) {
      // Max retries reached, notify admin
      await notifyAdminAboutFailedPayout(payoutTransactionId);
      return;
    }

    // Schedule retry after 1 hour
    setTimeout(async () => {
      try {
        await PayoutTransaction.findByIdAndUpdate(payoutTransactionId, {
          $inc: { retryCount: 1 },
          status: "pending",
        });

        console.log(
          `Retrying payout ${payoutTransactionId} (attempt ${payoutTransaction.retryCount + 1})`
        );
        await processPayout(payoutTransactionId);
      } catch (error) {
        console.error("Payout retry error:", error);
      }
    }, 60 * 60 * 1000); // 1 hour
  } catch (error) {
    console.error("Payout retry scheduling error:", error);
  }
};

/**
 * Notify admin about permanently failed payout
 * @param {string} payoutTransactionId - Payout transaction ID
 * @returns {Promise<void>}
 */
const notifyAdminAboutFailedPayout = async (payoutTransactionId) => {
  try {
    const payoutTransaction = await PayoutTransaction.findById(
      payoutTransactionId
    ).populate("ownerId bookingId");

    if (!payoutTransaction) {
      return;
    }

    // TODO: Implement admin notification (email, dashboard alert, etc.)
    console.error(
      `Payout failed permanently after 3 retries: ${payoutTransactionId}`
    );
    console.error("Details:", {
      bookingId: payoutTransaction.bookingId?._id,
      ownerId: payoutTransaction.ownerId?._id,
      amount: payoutTransaction.amount,
      upiId: payoutTransaction.upiId,
      failureReason: payoutTransaction.failureReason,
    });

    // You can implement email notification or dashboard alert here
  } catch (error) {
    console.error("Admin notification error:", error);
  }
};

/**
 * Get payout statistics for owner
 * @param {string} ownerId - Owner ID
 * @returns {Promise<Array>} - Payout statistics
 */
const getOwnerPayoutStats = async (ownerId) => {
  try {
    const stats = await PayoutTransaction.aggregate([
      { $match: { ownerId: mongoose.Types.ObjectId(ownerId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    return stats;
  } catch (error) {
    console.error("Get owner payout stats error:", error);
    throw error;
  }
};

/**
 * Get pending payouts for processing
 * @param {number} limit - Maximum number of payouts to fetch
 * @returns {Promise<Array>} - Pending payout transactions
 */
const getPendingPayouts = async (limit = 10) => {
  try {
    const pendingPayouts = await PayoutTransaction.find({
      status: "pending",
      retryCount: { $lt: 3 },
    })
      .populate("bookingId")
      .populate("ownerId")
      .sort({ createdAt: 1 })
      .limit(limit);

    return pendingPayouts;
  } catch (error) {
    console.error("Get pending payouts error:", error);
    throw error;
  }
};

/**
 * Process batch of pending payouts
 * @param {number} batchSize - Number of payouts to process
 * @returns {Promise<object>} - Processing results
 */
const processPendingPayouts = async (batchSize = 10) => {
  try {
    const pendingPayouts = await getPendingPayouts(batchSize);

    if (pendingPayouts.length === 0) {
      return { processed: 0, failed: 0, message: "No pending payouts" };
    }

    let processed = 0;
    let failed = 0;

    for (const payout of pendingPayouts) {
      try {
        await processPayout(payout._id);
        processed++;
      } catch (error) {
        console.error(`Failed to process payout ${payout._id}:`, error);
        failed++;
      }
    }

    return {
      processed,
      failed,
      message: `Processed ${processed} payouts, ${failed} failed`,
    };
  } catch (error) {
    console.error("Process pending payouts error:", error);
    throw error;
  }
};

module.exports = {
  triggerPayout,
  processPayout,
  handlePaymentCaptured,
  handlePayoutProcessed,
  handlePayoutFailed,
  getOwnerPayoutStats,
  getPendingPayouts,
  processPendingPayouts,
};