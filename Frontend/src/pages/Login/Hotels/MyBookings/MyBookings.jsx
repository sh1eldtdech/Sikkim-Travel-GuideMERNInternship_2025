import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyBookings } from "./api";
import "./MyBookings.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveImage = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

const statusConfig = {
  confirmed: { label: "Confirmed", color: "#2e7d32", bg: "#e8f5e9" },
  upcoming:  { label: "Upcoming",  color: "#1565c0", bg: "#e3f2fd" },
  completed: { label: "Completed", color: "#555",    bg: "#f5f5f5" },
  cancelled: { label: "Cancelled", color: "#c62828", bg: "#fce4ec" },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const filters = ["all", "confirmed", "upcoming", "completed", "cancelled"];
  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="mb-loading">
        <div className="mb-spinner" />
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-loading">
        <p style={{ color: "#c62828" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 16, padding: "10px 22px", background: "#1a1a2e",
            color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mb-page">
      <div className="mb-container">
        {/* Header */}
        <div className="mb-header">
          <div>
            <h1 className="mb-title">My Bookings</h1>
            <p className="mb-sub">
              {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="mb-explore-btn" onClick={() => navigate("/")}>
            Explore Hotels →
          </button>
        </div>

        {/* Stats */}
        <div className="mb-stats">
          {["confirmed", "upcoming", "completed"].map((s) => (
            <div key={s} className="mb-stat">
              <span className="mb-stat-num">
                {bookings.filter((b) => b.status === s).length}
              </span>
              <span className="mb-stat-label">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            </div>
          ))}
          <div className="mb-stat">
            <span className="mb-stat-num">
              ₹
              {bookings
                .filter((b) => b.paymentStatus === "paid")
                .reduce((a, b) => a + b.totalAmount, 0)
                .toLocaleString()}
            </span>
            <span className="mb-stat-label">Total Spent</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`mb-filter-chip ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && (
                <span className="mb-chip-count">
                  {bookings.filter((b) => b.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filtered.length === 0 ? (
          <div className="mb-empty">
            <span>📋</span>
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="mb-list">
            {filtered.map((booking) => {
              const sc = statusConfig[booking.status] || statusConfig.confirmed;
              // Support both populated and snapshot fields
              const hotelName = booking.hotelName || booking.hotel?.name || "Hotel";
              const hotelLocation = booking.hotelLocation || booking.hotel?.location || "";
              const roomType = booking.roomType || booking.room?.roomType || "";
              const image = booking.hotelImage || booking.hotel?.images?.[0] || "";

              return (
                <div className="mb-card" key={booking._id}>
                  <div className="mb-card-img">
                    <img
                      src={resolveImage(image)}
                      alt={hotelName}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400";
                      }}
                    />
                  </div>
                  <div className="mb-card-body">
                    <div className="mb-card-top">
                      <div>
                        <h3 className="mb-hotel-name">{hotelName}</h3>
                        {hotelLocation && (
                          <p className="mb-hotel-loc">📍 {hotelLocation}</p>
                        )}
                      </div>
                      <span
                        className="mb-status"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.label}
                      </span>
                    </div>

                    <div className="mb-card-mid">
                      <div className="mb-detail">
                        <span>Room</span>
                        <strong>{roomType}</strong>
                      </div>
                      <div className="mb-detail">
                        <span>Check-in</span>
                        <strong>{formatDate(booking.checkIn)}</strong>
                      </div>
                      <div className="mb-detail">
                        <span>Check-out</span>
                        <strong>{formatDate(booking.checkOut)}</strong>
                      </div>
                      <div className="mb-detail">
                        <span>Nights</span>
                        <strong>{booking.nights}</strong>
                      </div>
                    </div>

                    <div className="mb-card-footer">
                      <div className="mb-booking-id">
                        ID: BKG{booking._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="mb-amount">
                        ₹{booking.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
