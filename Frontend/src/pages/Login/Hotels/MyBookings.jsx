import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

const sampleBookings = [
  {
    _id: "BKG001",
    hotelName: "The Elgin Nor-Khill",
    location: "Gangtok, East Sikkim",
    roomType: "Deluxe Suite",
    checkIn: "2025-08-10",
    checkOut: "2025-08-13",
    nights: 3,
    amount: 23760,
    status: "confirmed",
    paymentId: "pay_abc123",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    _id: "BKG002",
    hotelName: "Pelling Himalayan View",
    location: "Pelling, West Sikkim",
    roomType: "Standard Room",
    checkIn: "2025-09-05",
    checkOut: "2025-09-07",
    nights: 2,
    amount: 7168,
    status: "upcoming",
    paymentId: "pay_def456",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400",
  },
  {
    _id: "BKG003",
    hotelName: "Ravangla Buddhist Retreat",
    location: "Ravangla, South Sikkim",
    roomType: "Standard Room",
    checkIn: "2025-06-15",
    checkOut: "2025-06-18",
    nights: 3,
    amount: 7392,
    status: "completed",
    paymentId: "pay_ghi789",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
  },
];

const statusConfig = {
  confirmed: { label: "Confirmed", color: "#2e7d32", bg: "#e8f5e9" },
  upcoming: { label: "Upcoming", color: "#1565c0", bg: "#e3f2fd" },
  completed: { label: "Completed", color: "#555", bg: "#f5f5f5" },
  cancelled: { label: "Cancelled", color: "#c62828", bg: "#fce4ec" },
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    // Simulated fetch — replace with: fetch("/my-bookings", { headers: { Authorization: `Bearer ${token}` } })
    setTimeout(() => {
      setBookings(sampleBookings);
      setLoading(false);
    }, 800);
  }, [navigate]);

  const filters = ["all", "confirmed", "upcoming", "completed", "cancelled"];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  if (loading) {
    return (
      <div className="mb-loading">
        <div className="mb-spinner" />
        <p>Loading your bookings...</p>
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
            <p className="mb-sub">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</p>
          </div>
          <button className="mb-explore-btn" onClick={() => navigate("/")}>
            Explore Hotels →
          </button>
        </div>

        {/* Stats */}
        <div className="mb-stats">
          {["confirmed", "upcoming", "completed"].map((s) => (
            <div key={s} className="mb-stat">
              <span className="mb-stat-num">{bookings.filter((b) => b.status === s).length}</span>
              <span className="mb-stat-label">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </div>
          ))}
          <div className="mb-stat">
            <span className="mb-stat-num">
              ₹{bookings.reduce((a, b) => a + b.amount, 0).toLocaleString()}
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
              return (
                <div className="mb-card" key={booking._id}>
                  <div className="mb-card-img">
                    <img src={booking.image} alt={booking.hotelName} />
                  </div>
                  <div className="mb-card-body">
                    <div className="mb-card-top">
                      <div>
                        <h3 className="mb-hotel-name">{booking.hotelName}</h3>
                        <p className="mb-hotel-loc">📍 {booking.location}</p>
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
                        <strong>{booking.roomType}</strong>
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
                      <div className="mb-booking-id">ID: {booking._id}</div>
                      <div className="mb-amount">₹{booking.amount.toLocaleString()}</div>
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
