import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../api";
import "./BookingPage.css";

export default function BookingPage() {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomId = searchParams.get("room");
  const roomType = searchParams.get("type") || "Deluxe Room";
  const pricePerNight = Number(searchParams.get("price")) || 0;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [nights, setNights] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingRef, setBookingRef] = useState(null);
  const [error, setError] = useState("");
  const [breakdown, setBreakdown] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 0);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  const taxes = Math.round(pricePerNight * nights * 0.12);
  const total = pricePerNight * nights + taxes;
  const today = new Date().toISOString().split("T")[0];

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setError("");
    if (!checkIn || !checkOut || nights < 1) {
      setError("Please select valid check-in and check-out dates.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create order on backend
      const orderData = await createOrder({
        hotelId,
        roomId,
        checkIn,
        checkOut,
        guests,
        specialRequests,
      });

      setBreakdown(orderData.breakdown);

      // Step 2: Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Razorpay failed to load. Check your internet connection.");
        setLoading(false);
        return;
      }

      // Step 3: Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Sikkim Tourism",
        description: `${roomType} — ${nights} night${nights > 1 ? "s" : ""}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Step 4: Verify payment with backend
            const result = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId,
            });

            setBookingRef(result.bookingRef || result.bookingId);
            setStep(3);
          } catch (err) {
            setError("Payment verification failed: " + err.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Guest",
          email: "",
          contact: "",
        },
        theme: { color: "#1a1a2e" },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="bp-success">
        <div className="bp-success-card">
          <div className="bp-success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>
            Your <strong>{roomType}</strong> has been booked successfully.
          </p>
          <div className="bp-success-details">
            <div className="bp-suc-row">
              <span>Booking Ref</span>
              <strong>{bookingRef}</strong>
            </div>
            <div className="bp-suc-row">
              <span>Check-in</span>
              <strong>{new Date(checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>
            </div>
            <div className="bp-suc-row">
              <span>Check-out</span>
              <strong>{new Date(checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>
            </div>
            <div className="bp-suc-row">
              <span>Nights</span>
              <strong>{nights}</strong>
            </div>
            <div className="bp-suc-row">
              <span>Total Paid</span>
              <strong>₹{(breakdown?.totalAmount || total).toLocaleString()}</strong>
            </div>
          </div>
          <button className="bp-home-btn" onClick={() => navigate("/my-bookings")}>
            View My Bookings →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bp-page">
      <div className="bp-container">
        {/* Left: Form */}
        <div className="bp-form-panel">
          <div className="bp-breadcrumb">
            <span onClick={() => navigate("/")} className="bp-link">Hotels</span>
            <span> / </span>
            <span>Booking</span>
          </div>

          <h1 className="bp-title">Complete Your Booking</h1>
          <p className="bp-subtitle">Fill in your stay details to proceed</p>

          <div className="bp-steps">
            <div className={`bp-step ${step >= 1 ? "active" : ""}`}>
              <span>1</span> Stay Details
            </div>
            <div className="bp-step-line" />
            <div className={`bp-step ${step >= 2 ? "active" : ""}`}>
              <span>2</span> Confirm
            </div>
            <div className="bp-step-line" />
            <div className={`bp-step ${step >= 3 ? "active" : ""}`}>
              <span>3</span> Payment
            </div>
          </div>

          {error && (
            <div className="bp-error">{error}</div>
          )}

          <div className="bp-form">
            <div className="bp-form-row">
              <div className="bp-form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    setCheckOut("");
                  }}
                />
              </div>
              <div className="bp-form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  disabled={!checkIn}
                />
              </div>
            </div>

            <div className="bp-form-group">
              <label>Number of Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n} Guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="bp-form-group">
              <label>Special Requests (optional)</label>
              <textarea
                rows={3}
                placeholder="Early check-in, extra pillows, dietary requirements..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </div>

          {nights > 0 && (
            <div className="bp-nights-banner">
              🌙 {nights} night{nights > 1 ? "s" : ""} selected
            </div>
          )}

          <button
            className={`bp-pay-btn ${loading ? "loading" : ""}`}
            onClick={handlePayment}
            disabled={loading || nights < 1}
          >
            {loading ? (
              <span className="bp-btn-spinner" />
            ) : (
              <>
                <span>Pay ₹{nights > 0 ? total.toLocaleString() : "—"}</span>
                <span className="bp-btn-sub">Secure Payment via Razorpay</span>
              </>
            )}
          </button>

          <p className="bp-secure-note">🔒 Your payment is 100% secure and encrypted</p>
        </div>

        {/* Right: Summary */}
        <div className="bp-summary">
          <div className="bp-summary-card">
            <div className="bp-summary-img" />
            <div className="bp-summary-body">
              <span className="bp-summary-tag">Sikkim Tourism</span>
              <h3 className="bp-summary-room">{roomType}</h3>
              <p className="bp-summary-hotel">Hotel ID: {hotelId}</p>

              <div className="bp-summary-breakdown">
                <div className="bp-sum-row">
                  <span>Room rate</span>
                  <span>₹{pricePerNight.toLocaleString()} × {nights || "—"} night{nights > 1 ? "s" : ""}</span>
                </div>
                <div className="bp-sum-row">
                  <span>Subtotal</span>
                  <span>{nights > 0 ? `₹${(pricePerNight * nights).toLocaleString()}` : "—"}</span>
                </div>
                <div className="bp-sum-row">
                  <span>GST (12%)</span>
                  <span>{nights > 0 ? `₹${taxes.toLocaleString()}` : "—"}</span>
                </div>
                <div className="bp-sum-row total">
                  <span>Total</span>
                  <span>{nights > 0 ? `₹${total.toLocaleString()}` : "—"}</span>
                </div>
              </div>

              <div className="bp-summary-policies">
                <div className="bp-pol">✅ Free cancellation (48h before)</div>
                <div className="bp-pol">✅ Instant confirmation</div>
                <div className="bp-pol">✅ No hidden charges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
