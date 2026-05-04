import React, { useState } from "react";
import { loadRazorpayScript, createRazorpayOrder, verifyRazorpayPayment, formatAmount } from "../../utils/razorpay";

const PaymentForm = ({ booking, onSuccess, onError, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Load Razorpay script if not already loaded
      if (typeof window.Razorpay === "undefined") {
        await loadRazorpayScript();
      }

      // Get user token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to continue");
      }

      // Create Razorpay order
      const orderResponse = await createRazorpayOrder(
        booking._id,
        booking.totalAmount,
        token
      );

      const { orderId, amount, keyId } = orderResponse;

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "Sikkim Travel Guide",
        description: `Booking for ${booking.hotelName || "Hotel"}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoading(true);

            // Verify payment
            const verifyResponse = await verifyRazorpayPayment(
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: booking._id,
              },
              token
            );

            if (verifyResponse.success) {
              onSuccess && onSuccess(verifyResponse.booking);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setError(error.message || "Payment verification failed");
            onError && onError(error);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: booking.userName || "",
          email: booking.userEmail || "",
          contact: booking.userPhone || "",
        },
        notes: {
          booking_id: booking._id,
          hotel_id: booking.hotel,
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: false,
          paylater: false,
        },
        config: {
          display: {
            blocks: {
              utib: {
                name: "Pay via UPI",
                instruments: [
                  {
                    method: "upi",
                    flows: ["qr"],
                  },
                ],
              },
              other: {
                name: "Other Payment Modes",
                instruments: [
                  {
                    method: "card",
                  },
                  {
                    method: "netbanking",
                  },
                  {
                    method: "wallet",
                  },
                ],
              },
            },
            sequence: ["block.utib", "block.other"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        const errorDescription =
          response.error.description || "Payment failed";
        setError(errorDescription);
        onError && onError(new Error(errorDescription));
        setLoading(false);
      });

      rzp.on("payment.cancel", function () {
        setError("Payment cancelled");
        onCancel && onCancel();
        setLoading(false);
      });
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment processing failed");
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="payment-summary">
        <h3>Complete Your Payment</h3>
        <div className="payment-details">
          <div className="detail-row">
            <span>Hotel:</span>
            <span>{booking.hotelName || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span>Room Type:</span>
            <span>{booking.roomType || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span>Check-in:</span>
            <span>
              {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="detail-row">
            <span>Check-out:</span>
            <span>
              {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="detail-row">
            <span>Nights:</span>
            <span>{booking.nights}</span>
          </div>
          <div className="detail-row subtotal">
            <span>Subtotal:</span>
            <span>{formatAmount(booking.subtotal)}</span>
          </div>
          <div className="detail-row taxes">
            <span>Taxes:</span>
            <span>{formatAmount(booking.taxes)}</span>
          </div>
          <div className="detail-row total">
            <span>Total Amount:</span>
            <span className="amount">{formatAmount(booking.totalAmount)}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="payment-actions">
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`pay-button ${loading ? "loading" : ""}`}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            `Pay ${formatAmount(booking.totalAmount)}`
          )}
        </button>
        <button
          onClick={() => onCancel && onCancel()}
          disabled={loading}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>

      <div className="payment-info">
        <p className="secure-payment">
          🔒 Secure payment powered by Razorpay
        </p>
        <p className="payment-methods">
          Accepts: UPI, Cards, Net Banking, Wallets
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;