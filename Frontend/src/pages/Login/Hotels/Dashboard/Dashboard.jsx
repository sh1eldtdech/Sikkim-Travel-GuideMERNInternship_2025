import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOwnerHotels, fetchOwnerBookings, addHotel, addRoom, updateRoom } from "./api";
import "./Dashboard.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inline room editing
  const [editingRoom, setEditingRoom] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [savingRoom, setSavingRoom] = useState(false);

  // Add hotel form
  const [addHotelForm, setAddHotelForm] = useState({
    name: "", district: "East", location: "", description: "",
    amenities: "", checkIn: "2:00 PM", checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 48 hours before check-in",
  });
  const [hotelImages, setHotelImages] = useState(null);
  const [addHotelLoading, setAddHotelLoading] = useState(false);
  const [addHotelMsg, setAddHotelMsg] = useState("");

  // Add room form
  const [addRoomForm, setAddRoomForm] = useState({
    hotelId: "", roomType: "", minPrice: "", maxPrice: "", totalRooms: "", availableRooms: "", features: "",
  });
  const [addRoomLoading, setAddRoomLoading] = useState(false);
  const [addRoomMsg, setAddRoomMsg] = useState("");

  // Load data on mount
  useEffect(() => {
    const token = localStorage.getItem("ownerToken");
    if (!token) {
      navigate("/owner/login");
      return;
    }
    loadAll();
  }, [navigate]);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [hotelsData, bookingsData] = await Promise.all([
        fetchOwnerHotels(),
        fetchOwnerBookings(),
      ]);
      setHotels(hotelsData.hotels || []);
      setBookings(bookingsData.bookings || []);
      setBookingStats(bookingsData.stats || {});
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ── Inline room edit ───────────────────────────────────────────────
  const handleRoomEdit = (room) => {
    setEditingRoom(room._id);
    setEditValues({ minPrice: room.minPrice || room.price, maxPrice: room.maxPrice || room.price, availableRooms: room.availableRooms });
  };

  const handleRoomSave = async (roomId) => {
    setSavingRoom(true);
    try {
      const updated = await updateRoom(roomId, {
        minPrice: Number(editValues.minPrice),
        maxPrice: Number(editValues.maxPrice),
        availableRooms: Number(editValues.availableRooms),
      });
      // Update local state
      setHotels((prev) =>
        prev.map((h) => ({
          ...h,
          rooms: h.rooms.map((r) =>
            r._id === roomId ? { ...r, ...updated.room } : r
          ),
        }))
      );
      setEditingRoom(null);
      setSaveSuccess(roomId);
      setTimeout(() => setSaveSuccess(null), 2500);
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSavingRoom(false);
    }
  };

  // ── Add hotel ──────────────────────────────────────────────────────
  const handleAddHotel = async (e) => {
    e.preventDefault();
    setAddHotelLoading(true);
    setAddHotelMsg("");

    try {
      const formData = new FormData();
      formData.append("name", addHotelForm.name);
      formData.append("district", addHotelForm.district);
      formData.append("location", addHotelForm.location);
      formData.append("description", addHotelForm.description);

      // Parse amenities as JSON array
      const amenitiesArr = addHotelForm.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      formData.append("amenities", JSON.stringify(amenitiesArr));

      formData.append(
        "policies",
        JSON.stringify({
          checkIn: addHotelForm.checkIn,
          checkOut: addHotelForm.checkOut,
          cancellation: addHotelForm.cancellation,
        })
      );

      if (hotelImages) {
        Array.from(hotelImages).forEach((f) => formData.append("images", f));
      }

      const data = await addHotel(formData);
      setAddHotelMsg("✅ Hotel added successfully! It is now live on the hotel listing.");
      // Add the new hotel to local state
      setHotels((prev) => [...prev, { ...data.hotel, rooms: [] }]);
      setAddHotelForm({
        name: "", district: "East", location: "", description: "",
        amenities: "", checkIn: "2:00 PM", checkOut: "11:00 AM",
        cancellation: "Free cancellation up to 48 hours before check-in",
      });
      setHotelImages(null);
    } catch (err) {
      setAddHotelMsg("❌ " + (err.message || "Failed to add hotel"));
    } finally {
      setAddHotelLoading(false);
    }
  };

  // ── Add room ───────────────────────────────────────────────────────
  const handleAddRoom = async (e) => {
    e.preventDefault();
    setAddRoomLoading(true);
    setAddRoomMsg("");

    try {
      const featuresArr = addRoomForm.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const data = await addRoom({
        hotelId: addRoomForm.hotelId,
        roomType: addRoomForm.roomType,
        minPrice: Number(addRoomForm.minPrice),
        maxPrice: Number(addRoomForm.maxPrice),
        totalRooms: Number(addRoomForm.totalRooms),
        availableRooms: Number(addRoomForm.availableRooms),
        features: JSON.stringify(featuresArr),
      });

      setAddRoomMsg("✅ Room added! It is now visible to tourists on the hotel page.");
      // Update hotel in local state
      setHotels((prev) =>
        prev.map((h) =>
          h._id === addRoomForm.hotelId
            ? { ...h, rooms: [...h.rooms, data.room] }
            : h
        )
      );
      setAddRoomForm({
        hotelId: "", roomType: "", minPrice: "", maxPrice: "", totalRooms: "", availableRooms: "", features: "",
      });
    } catch (err) {
      setAddRoomMsg("❌ " + (err.message || "Failed to add room"));
    } finally {
      setAddRoomLoading(false);
    }
  };

  const ownerInfo = JSON.parse(localStorage.getItem("ownerInfo") || "{}");

  const totalRooms = hotels.reduce((s, h) => s + (h.rooms?.length || 0), 0);

  const tabs = [
    { id: "overview", label: "Overview",   icon: "📊" },
    { id: "hotels",   label: "My Hotels",  icon: "🏨" },
    { id: "add-hotel", label: "Add Hotel", icon: "➕" },
    { id: "add-room",  label: "Add Room",  icon: "🛏️" },
    { id: "bookings",  label: "Bookings",  icon: "📅" },
  ];

  if (loading) {
    return (
      <div className="db-layout" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#8a9ba8" }}>
          <div className="hd-spinner" style={{ margin: "0 auto 16px" }} />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="db-layout">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-logo">
          <span>🏔️</span>
          <div>
            <div className="db-logo-title">Sikkim Tourism</div>
            <div className="db-logo-sub">Owner Panel</div>
          </div>
        </div>

        <nav className="db-nav">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`db-nav-item ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="db-nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <button
            className="db-logout"
            onClick={() => {
              localStorage.removeItem("ownerToken");
              localStorage.removeItem("ownerInfo");
              navigate("/owner/login");
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="db-main">
        <div className="db-topbar">
          <h1 className="db-page-title">
            {tabs.find((t) => t.id === activeTab)?.icon}{" "}
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <div className="db-owner-badge">
            Welcome, {ownerInfo.name || "Owner"} ✓
          </div>
        </div>

        {error && (
          <div style={{
            margin: 24, padding: 16, background: "#fce4ec",
            color: "#c62828", borderRadius: 12, fontSize: 14,
          }}>
            {error}{" "}
            <button onClick={loadAll} style={{
              marginLeft: 12, padding: "4px 12px", background: "#c62828",
              color: "#fff", border: "none", borderRadius: 6, cursor: "pointer",
            }}>
              Retry
            </button>
          </div>
        )}

        {/* ── OVERVIEW ─────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="db-overview">
            <div className="db-stats-grid">
              <div className="db-stat-card">
                <span className="db-stat-icon">🏨</span>
                <div className="db-stat-val">{hotels.length}</div>
                <div className="db-stat-lbl">Total Hotels</div>
              </div>
              <div className="db-stat-card">
                <span className="db-stat-icon">🛏️</span>
                <div className="db-stat-val">{totalRooms}</div>
                <div className="db-stat-lbl">Total Room Types</div>
              </div>
              <div className="db-stat-card">
                <span className="db-stat-icon">📅</span>
                <div className="db-stat-val">{bookingStats.totalBookings || 0}</div>
                <div className="db-stat-lbl">Total Bookings</div>
              </div>
              <div className="db-stat-card gold">
                <span className="db-stat-icon">💰</span>
                <div className="db-stat-val">
                  ₹{(bookingStats.totalRevenue || 0).toLocaleString()}
                </div>
                <div className="db-stat-lbl">Total Revenue</div>
              </div>
            </div>

            <h2 className="db-section-title">Recent Bookings</h2>
            <div className="db-table-wrap">
              {bookings.length === 0 ? (
                <p style={{ padding: 32, color: "#8a9ba8", textAlign: "center" }}>
                  No bookings yet. Add hotels and rooms to start receiving bookings.
                </p>
              ) : (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Guest</th>
                      <th>Hotel / Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 8).map((b) => {
                      const sc = statusConfig[b.status] || statusConfig.confirmed;
                      return (
                        <tr key={b._id}>
                          <td className="db-mono">BKG{b._id.slice(-8).toUpperCase()}</td>
                          <td>{b.user?.name || "Guest"}</td>
                          <td>
                            <strong>{b.hotelName || b.hotel?.name}</strong>
                            <br />
                            <span className="db-room-sub">{b.roomType || b.room?.roomType}</span>
                          </td>
                          <td>{formatDate(b.checkIn)}</td>
                          <td>{formatDate(b.checkOut)}</td>
                          <td className="db-amount">₹{b.totalAmount.toLocaleString()}</td>
                          <td>
                            <span
                              className="db-status-badge"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── MY HOTELS ─────────────────────────────────────────────── */}
        {activeTab === "hotels" && (
          <div className="db-hotels">
            {hotels.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#8a9ba8" }}>
                <p style={{ fontSize: 48 }}>🏨</p>
                <p style={{ marginTop: 16 }}>No hotels yet. Add your first hotel!</p>
                <button
                  onClick={() => setActiveTab("add-hotel")}
                  style={{
                    marginTop: 16, padding: "12px 24px", background: "#1a1a2e",
                    color: "#fff", border: "none", borderRadius: 10, cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  ➕ Add Hotel
                </button>
              </div>
            ) : (
              hotels.map((hotel) => (
                <div className="db-hotel-card" key={hotel._id}>
                  <div className="db-hotel-header">
                    <div>
                      <h3>{hotel.name}</h3>
                      <p>📍 {hotel.location}, {hotel.district} Sikkim</p>
                    </div>
                    <span className="db-room-count">
                      {hotel.rooms?.length || 0} room type{hotel.rooms?.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {hotel.rooms?.length === 0 ? (
                    <p style={{ padding: "20px 24px", color: "#8a9ba8", fontSize: 14 }}>
                      No rooms added yet.{" "}
                      <button
                        onClick={() => {
                          setAddRoomForm((p) => ({ ...p, hotelId: hotel._id }));
                          setActiveTab("add-room");
                        }}
                        style={{
                          background: "none", border: "none", color: "#c9a84c",
                          fontWeight: 600, cursor: "pointer", textDecoration: "underline",
                        }}
                      >
                        Add a room
                      </button>
                    </p>
                  ) : (
                    <div className="db-rooms-table-wrap">
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>Room Type</th>
                            <th>Price Range</th>
                            <th>Available</th>
                            <th>Total</th>
                            <th>Occupancy</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hotel.rooms.map((room) => (
                            <tr key={room._id}>
                              <td style={{ fontWeight: 600 }}>{room.roomType}</td>
                              <td>
                                {editingRoom === room._id ? (
                                  <div style={{ display: "flex", gap: "4px" }}>
                                    <input
                                      type="number"
                                      value={editValues.minPrice}
                                      min={0}
                                      onChange={(e) =>
                                        setEditValues((v) => ({ ...v, minPrice: e.target.value }))
                                      }
                                      className="db-inline-input"
                                    />
                                    <input
                                      type="number"
                                      value={editValues.maxPrice}
                                      min={0}
                                      onChange={(e) =>
                                        setEditValues((v) => ({ ...v, maxPrice: e.target.value }))
                                      }
                                      className="db-inline-input"
                                    />
                                  </div>
                                ) : (
                                  `₹${(room.minPrice || room.price || 0).toLocaleString()} - ₹${(room.maxPrice || room.price || 0).toLocaleString()}`
                                )}
                              </td>
                              <td>
                                {editingRoom === room._id ? (
                                  <input
                                    type="number"
                                    value={editValues.availableRooms}
                                    min={0}
                                    max={room.totalRooms}
                                    onChange={(e) =>
                                      setEditValues((v) => ({
                                        ...v,
                                        availableRooms: e.target.value,
                                      }))
                                    }
                                    className="db-inline-input small"
                                  />
                                ) : (
                                  <span
                                    className={`db-avail-badge ${
                                      room.availableRooms === 0
                                        ? "none"
                                        : room.availableRooms <= 1
                                        ? "low"
                                        : ""
                                    }`}
                                  >
                                    {room.availableRooms}
                                  </span>
                                )}
                              </td>
                              <td>{room.totalRooms}</td>
                              <td>
                                <div className="db-occupancy-bar">
                                  <div
                                    className="db-occ-fill"
                                    style={{
                                      width: `${
                                        room.totalRooms > 0
                                          ? ((room.totalRooms - room.availableRooms) /
                                              room.totalRooms) *
                                            100
                                          : 0
                                      }%`,
                                    }}
                                  />
                                </div>
                                <span className="db-occ-pct">
                                  {room.totalRooms > 0
                                    ? Math.round(
                                        ((room.totalRooms - room.availableRooms) /
                                          room.totalRooms) *
                                          100
                                      )
                                    : 0}
                                  %
                                </span>
                              </td>
                              <td>
                                {editingRoom === room._id ? (
                                  <div className="db-edit-actions">
                                    <button
                                      className="db-save-btn"
                                      onClick={() => handleRoomSave(room._id)}
                                      disabled={savingRoom}
                                    >
                                      {savingRoom ? "..." : "Save"}
                                    </button>
                                    <button
                                      className="db-cancel-btn"
                                      onClick={() => setEditingRoom(null)}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="db-edit-btn"
                                    onClick={() => handleRoomEdit(room)}
                                  >
                                    {saveSuccess === room._id ? "✓ Saved" : "Edit"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── ADD HOTEL ─────────────────────────────────────────────── */}
        {activeTab === "add-hotel" && (
          <div className="db-form-panel">
            {addHotelMsg && (
              <div style={{
                padding: 16, marginBottom: 20, borderRadius: 12, fontSize: 14,
                background: addHotelMsg.startsWith("✅") ? "#e8f5e9" : "#fce4ec",
                color: addHotelMsg.startsWith("✅") ? "#2e7d32" : "#c62828",
              }}>
                {addHotelMsg}
              </div>
            )}
            <form onSubmit={handleAddHotel} className="db-form">
              <div className="db-form-group">
                <label>Hotel Name *</label>
                <input
                  required
                  placeholder="e.g. The Mountain Retreat"
                  value={addHotelForm.name}
                  onChange={(e) => setAddHotelForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="db-form-row">
                <div className="db-form-group">
                  <label>District *</label>
                  <select
                    value={addHotelForm.district}
                    onChange={(e) => setAddHotelForm((p) => ({ ...p, district: e.target.value }))}
                  >
                    {["East", "West", "North", "South"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="db-form-group">
                  <label>Location / Town *</label>
                  <input
                    required
                    placeholder="e.g. Gangtok"
                    value={addHotelForm.location}
                    onChange={(e) => setAddHotelForm((p) => ({ ...p, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="db-form-group">
                <label>Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your hotel — surroundings, unique features, history..."
                  value={addHotelForm.description}
                  onChange={(e) => setAddHotelForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="db-form-group">
                <label>Amenities (comma-separated)</label>
                <input
                  placeholder="Free WiFi, Restaurant, Spa, Parking, Mountain View..."
                  value={addHotelForm.amenities}
                  onChange={(e) => setAddHotelForm((p) => ({ ...p, amenities: e.target.value }))}
                />
              </div>
              <div className="db-form-row">
                <div className="db-form-group">
                  <label>Check-in Time</label>
                  <input
                    placeholder="2:00 PM"
                    value={addHotelForm.checkIn}
                    onChange={(e) => setAddHotelForm((p) => ({ ...p, checkIn: e.target.value }))}
                  />
                </div>
                <div className="db-form-group">
                  <label>Check-out Time</label>
                  <input
                    placeholder="11:00 AM"
                    value={addHotelForm.checkOut}
                    onChange={(e) => setAddHotelForm((p) => ({ ...p, checkOut: e.target.value }))}
                  />
                </div>
              </div>
              <div className="db-form-group">
                <label>Hotel Images (up to 6 photos)</label>
                <div className="ol-file-upload">
                  <input
                    type="file"
                    id="hotel-images"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    onChange={(e) => setHotelImages(e.target.files)}
                  />
                  <label htmlFor="hotel-images" className="ol-file-label">
                    {hotelImages && hotelImages.length > 0
                      ? `${hotelImages.length} image(s) selected`
                      : "📷 Click to upload hotel photos"}
                  </label>
                </div>
              </div>
              <button type="submit" className="db-submit-btn" disabled={addHotelLoading}>
                {addHotelLoading ? "Adding Hotel..." : "➕ Add Hotel"}
              </button>
            </form>
          </div>
        )}

        {/* ── ADD ROOM ──────────────────────────────────────────────── */}
        {activeTab === "add-room" && (
          <div className="db-form-panel">
            {addRoomMsg && (
              <div style={{
                padding: 16, marginBottom: 20, borderRadius: 12, fontSize: 14,
                background: addRoomMsg.startsWith("✅") ? "#e8f5e9" : "#fce4ec",
                color: addRoomMsg.startsWith("✅") ? "#2e7d32" : "#c62828",
              }}>
                {addRoomMsg}
              </div>
            )}
            <form onSubmit={handleAddRoom} className="db-form">
              <div className="db-form-group">
                <label>Select Hotel *</label>
                <select
                  required
                  value={addRoomForm.hotelId}
                  onChange={(e) => setAddRoomForm((p) => ({ ...p, hotelId: e.target.value }))}
                >
                  <option value="">-- Select your hotel --</option>
                  {hotels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name} ({h.district} Sikkim)
                    </option>
                  ))}
                </select>
              </div>
              <div className="db-form-group">
                <label>Room Type *</label>
                <input
                  required
                  placeholder="e.g. Deluxe Suite, Standard Room, Mountain View Villa..."
                  value={addRoomForm.roomType}
                  onChange={(e) => setAddRoomForm((p) => ({ ...p, roomType: e.target.value }))}
                />
              </div>
              <div className="db-form-row">
                <div className="db-form-group">
                  <label>Min Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="e.g. 4500"
                    value={addRoomForm.minPrice}
                    onChange={(e) => setAddRoomForm((p) => ({ ...p, minPrice: e.target.value }))}
                  />
                </div>
                <div className="db-form-group">
                  <label>Max Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="e.g. 6000"
                    value={addRoomForm.maxPrice}
                    onChange={(e) => setAddRoomForm((p) => ({ ...p, maxPrice: e.target.value }))}
                  />
                </div>
              </div>
              <div className="db-form-row">
                <div className="db-form-group">
                  <label>Total Rooms *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    value={addRoomForm.totalRooms}
                    onChange={(e) => setAddRoomForm((p) => ({ ...p, totalRooms: e.target.value }))}
                  />
                </div>
                <div className="db-form-group">
                  <label>Available Now *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    value={addRoomForm.availableRooms}
                    onChange={(e) =>
                      setAddRoomForm((p) => ({ ...p, availableRooms: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="db-form-group">
                <label>Room Features (comma-separated)</label>
                <input
                  placeholder="Mountain View, King Bed, Private Balcony, Jacuzzi..."
                  value={addRoomForm.features}
                  onChange={(e) => setAddRoomForm((p) => ({ ...p, features: e.target.value }))}
                />
              </div>
              <button type="submit" className="db-submit-btn" disabled={addRoomLoading}>
                {addRoomLoading ? "Adding Room..." : "🛏️ Add Room"}
              </button>
            </form>
          </div>
        )}

        {/* ── BOOKINGS ──────────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div style={{ padding: 32 }}>
            {/* Quick stats row */}
            <div className="db-stats-grid" style={{ marginBottom: 28 }}>
              {["confirmed", "upcoming", "completed", "cancelled"].map((s) => {
                const icons = { confirmed: "✅", upcoming: "🔜", completed: "🏁", cancelled: "❌" };
                return (
                  <div className="db-stat-card" key={s}>
                    <span className="db-stat-icon">{icons[s]}</span>
                    <div className="db-stat-val">{bookingStats[s] || 0}</div>
                    <div className="db-stat-lbl">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
                  </div>
                );
              })}
            </div>

            <div className="db-table-wrap">
              {bookings.length === 0 ? (
                <p style={{ padding: 32, color: "#8a9ba8", textAlign: "center" }}>
                  No bookings yet.
                </p>
              ) : (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Guest</th>
                      <th>Hotel / Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => {
                      const sc = statusConfig[b.status] || statusConfig.confirmed;
                      return (
                        <tr key={b._id}>
                          <td className="db-mono">BKG{b._id.slice(-8).toUpperCase()}</td>
                          <td>
                            <strong>{b.user?.name || "Guest"}</strong>
                            <br />
                            <span style={{ fontSize: 11, color: "#8a9ba8" }}>
                              {b.user?.email}
                            </span>
                          </td>
                          <td>
                            <strong>{b.hotelName || b.hotel?.name}</strong>
                            <br />
                            <span className="db-room-sub">{b.roomType || b.room?.roomType}</span>
                          </td>
                          <td>{formatDate(b.checkIn)}</td>
                          <td>{formatDate(b.checkOut)}</td>
                          <td className="db-amount">₹{b.totalAmount.toLocaleString()}</td>
                          <td>
                            <span
                              className="db-status-badge"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
