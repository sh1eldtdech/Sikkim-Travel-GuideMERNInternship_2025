import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const sampleStats = {
  totalHotels: 2,
  totalRooms: 8,
  totalBookings: 34,
  totalRevenue: 182400,
  recentBookings: [
    { id: "BKG2301", guest: "Arjun Sharma", hotel: "The Elgin Nor-Khill", room: "Deluxe Suite", checkIn: "2025-08-10", checkOut: "2025-08-13", amount: 23760, status: "confirmed" },
    { id: "BKG2302", guest: "Priya Mehta", hotel: "The Elgin Nor-Khill", room: "Royal Suite", checkIn: "2025-08-15", checkOut: "2025-08-17", amount: 26880, status: "upcoming" },
    { id: "BKG2303", guest: "Rahul Das", hotel: "Nathula Heritage Inn", room: "Standard", checkIn: "2025-07-20", checkOut: "2025-07-22", amount: 6272, status: "completed" },
  ],
  hotels: [
    {
      _id: "h1",
      name: "The Elgin Nor-Khill",
      district: "East",
      location: "Gangtok",
      rooms: [
        { _id: "r1", roomType: "Standard Heritage", price: 4500, availableRooms: 3, total: 5 },
        { _id: "r2", roomType: "Deluxe Suite", price: 7200, availableRooms: 2, total: 4 },
        { _id: "r3", roomType: "Royal Suite", price: 12000, availableRooms: 1, total: 1 },
      ],
    },
    {
      _id: "h2",
      name: "Nathula Heritage Inn",
      district: "East",
      location: "Tsomgo",
      rooms: [
        { _id: "r4", roomType: "Standard Room", price: 2800, availableRooms: 4, total: 4 },
        { _id: "r5", roomType: "Deluxe Room", price: 3800, availableRooms: 2, total: 3 },
      ],
    },
  ],
};

const statusConfig = {
  confirmed: { label: "Confirmed", color: "#2e7d32", bg: "#e8f5e9" },
  upcoming: { label: "Upcoming", color: "#1565c0", bg: "#e3f2fd" },
  completed: { label: "Completed", color: "#555", bg: "#f5f5f5" },
};

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(sampleStats);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(null);

  const [addHotelForm, setAddHotelForm] = useState({ name: "", district: "East", location: "", description: "" });
  const [addRoomForm, setAddRoomForm] = useState({ hotelId: "", roomType: "", price: "", availableRooms: "", total: "" });

  const handleRoomEdit = (room) => {
    setEditingRoom(room._id);
    setEditValues({ price: room.price, availableRooms: room.availableRooms });
  };

  const handleRoomSave = (hotelId, roomId) => {
    // Real app: PUT /room/update { roomId, price, availableRooms }
    setStats((prev) => ({
      ...prev,
      hotels: prev.hotels.map((h) =>
        h._id === hotelId
          ? { ...h, rooms: h.rooms.map((r) => r._id === roomId ? { ...r, price: Number(editValues.price), availableRooms: Number(editValues.availableRooms) } : r) }
          : h
      ),
    }));
    setEditingRoom(null);
    setSaveSuccess(roomId);
    setTimeout(() => setSaveSuccess(null), 2000);
  };

  const handleAddHotel = (e) => {
    e.preventDefault();
    // Real app: POST /hotel/add
    const newHotel = { _id: "h" + Date.now(), ...addHotelForm, rooms: [] };
    setStats((prev) => ({ ...prev, hotels: [...prev.hotels, newHotel], totalHotels: prev.totalHotels + 1 }));
    setAddHotelForm({ name: "", district: "East", location: "", description: "" });
    setActiveTab("hotels");
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    // Real app: POST /room/add
    const newRoom = { _id: "r" + Date.now(), roomType: addRoomForm.roomType, price: Number(addRoomForm.price), availableRooms: Number(addRoomForm.availableRooms), total: Number(addRoomForm.total) };
    setStats((prev) => ({
      ...prev,
      hotels: prev.hotels.map((h) => h._id === addRoomForm.hotelId ? { ...h, rooms: [...h.rooms, newRoom] } : h),
      totalRooms: prev.totalRooms + 1,
    }));
    setAddRoomForm({ hotelId: "", roomType: "", price: "", availableRooms: "", total: "" });
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "hotels", label: "My Hotels", icon: "🏨" },
    { id: "add-hotel", label: "Add Hotel", icon: "➕" },
    { id: "add-room", label: "Add Room", icon: "🛏️" },
    { id: "bookings", label: "Bookings", icon: "📅" },
  ];

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
          <button className="db-logout" onClick={() => { localStorage.removeItem("ownerToken"); navigate("/owner/login"); }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="db-main">
        <div className="db-topbar">
          <h1 className="db-page-title">
            {tabs.find((t) => t.id === activeTab)?.icon}{" "}
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <div className="db-owner-badge">Welcome, Owner ✓</div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="db-overview">
            <div className="db-stats-grid">
              <div className="db-stat-card">
                <span className="db-stat-icon">🏨</span>
                <div className="db-stat-val">{stats.totalHotels}</div>
                <div className="db-stat-lbl">Total Hotels</div>
              </div>
              <div className="db-stat-card">
                <span className="db-stat-icon">🛏️</span>
                <div className="db-stat-val">{stats.totalRooms}</div>
                <div className="db-stat-lbl">Total Rooms</div>
              </div>
              <div className="db-stat-card">
                <span className="db-stat-icon">📅</span>
                <div className="db-stat-val">{stats.totalBookings}</div>
                <div className="db-stat-lbl">Total Bookings</div>
              </div>
              <div className="db-stat-card gold">
                <span className="db-stat-icon">💰</span>
                <div className="db-stat-val">₹{stats.totalRevenue.toLocaleString()}</div>
                <div className="db-stat-lbl">Total Revenue</div>
              </div>
            </div>

            <h2 className="db-section-title">Recent Bookings</h2>
            <div className="db-table-wrap">
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
                  {stats.recentBookings.map((b) => {
                    const sc = statusConfig[b.status] || statusConfig.confirmed;
                    return (
                      <tr key={b.id}>
                        <td className="db-mono">{b.id}</td>
                        <td>{b.guest}</td>
                        <td>
                          <strong>{b.hotel}</strong>
                          <br />
                          <span className="db-room-sub">{b.room}</span>
                        </td>
                        <td>{formatDate(b.checkIn)}</td>
                        <td>{formatDate(b.checkOut)}</td>
                        <td className="db-amount">₹{b.amount.toLocaleString()}</td>
                        <td>
                          <span className="db-status-badge" style={{ background: sc.bg, color: sc.color }}>
                            {sc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MY HOTELS */}
        {activeTab === "hotels" && (
          <div className="db-hotels">
            {stats.hotels.map((hotel) => (
              <div key={hotel._id} className="db-hotel-card">
                <div className="db-hotel-header">
                  <div>
                    <h3>{hotel.name}</h3>
                    <p>📍 {hotel.location}, {hotel.district} Sikkim</p>
                  </div>
                  <span className="db-room-count">{hotel.rooms.length} room types</span>
                </div>

                <div className="db-rooms-table-wrap">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Room Type</th>
                        <th>Price/Night</th>
                        <th>Available</th>
                        <th>Total Rooms</th>
                        <th>Occupancy</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotel.rooms.map((room) => (
                        <tr key={room._id}>
                          <td><strong>{room.roomType}</strong></td>
                          <td>
                            {editingRoom === room._id ? (
                              <input
                                type="number"
                                value={editValues.price}
                                onChange={(e) => setEditValues((v) => ({ ...v, price: e.target.value }))}
                                className="db-inline-input"
                              />
                            ) : (
                              `₹${room.price.toLocaleString()}`
                            )}
                          </td>
                          <td>
                            {editingRoom === room._id ? (
                              <input
                                type="number"
                                value={editValues.availableRooms}
                                onChange={(e) => setEditValues((v) => ({ ...v, availableRooms: e.target.value }))}
                                className="db-inline-input small"
                              />
                            ) : (
                              <span className={`db-avail-badge ${room.availableRooms === 0 ? "none" : room.availableRooms <= 1 ? "low" : ""}`}>
                                {room.availableRooms}
                              </span>
                            )}
                          </td>
                          <td>{room.total}</td>
                          <td>
                            <div className="db-occupancy-bar">
                              <div className="db-occ-fill" style={{ width: `${((room.total - room.availableRooms) / room.total) * 100}%` }} />
                            </div>
                            <span className="db-occ-pct">{Math.round(((room.total - room.availableRooms) / room.total) * 100)}%</span>
                          </td>
                          <td>
                            {editingRoom === room._id ? (
                              <div className="db-edit-actions">
                                <button className="db-save-btn" onClick={() => handleRoomSave(hotel._id, room._id)}>Save</button>
                                <button className="db-cancel-btn" onClick={() => setEditingRoom(null)}>×</button>
                              </div>
                            ) : (
                              <button className="db-edit-btn" onClick={() => handleRoomEdit(room)}>
                                {saveSuccess === room._id ? "✓ Saved" : "Edit"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD HOTEL */}
        {activeTab === "add-hotel" && (
          <div className="db-form-panel">
            <form onSubmit={handleAddHotel} className="db-form">
              <div className="db-form-group">
                <label>Hotel Name</label>
                <input
                  required
                  placeholder="e.g. The Mountain Retreat"
                  value={addHotelForm.name}
                  onChange={(e) => setAddHotelForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="db-form-row">
                <div className="db-form-group">
                  <label>District</label>
                  <select value={addHotelForm.district} onChange={(e) => setAddHotelForm((p) => ({ ...p, district: e.target.value }))}>
                    {["East", "West", "North", "South"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="db-form-group">
                  <label>Location / Town</label>
                  <input
                    required
                    placeholder="e.g. Gangtok"
                    value={addHotelForm.location}
                    onChange={(e) => setAddHotelForm((p) => ({ ...p, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="db-form-group">
                <label>Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your hotel..."
                  value={addHotelForm.description}
                  onChange={(e) => setAddHotelForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <button type="submit" className="db-submit-btn">➕ Add Hotel</button>
            </form>
          </div>
        )}

        {/* ADD ROOM */}
        {activeTab === "add-room" && (
          <div className="db-form-panel">
            <form onSubmit={handleAddRoom} className="db-form">
              <div className="db-form-group">
                <label>Select Hotel</label>
                <select required value={addRoomForm.hotelId} onChange={(e) => setAddRoomForm((p) => ({ ...p, hotelId: e.target.value }))}>
                  <option value="">-- Select Hotel --</option>
                  {stats.hotels.map((h) => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>
              <div className="db-form-group">
                <label>Room Type</label>
                <input
                  required
                  placeholder="e.g. Deluxe Suite"
                  value={addRoomForm.roomType}
                  onChange={(e) => setAddRoomForm((p) => ({ ...p, roomType: e.target.value }))}
                />
              </div>
              <div className="db-form-row">
                <div className="db-form-group">
                  <label>Price per Night (₹)</label>
                  <input
                    required type="number" min="0"
                    placeholder="e.g. 4500"
                    value={addRoomForm.price}
                    onChange={(e) => setAddRoomForm((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>
                <div className="db-form-group">
                  <label>Total Rooms</label>
                  <input
                    required type="number" min="1"
                    placeholder="e.g. 5"
                    value={addRoomForm.total}
                    onChange={(e) => setAddRoomForm((p) => ({ ...p, total: e.target.value }))}
                  />
                </div>
                <div className="db-form-group">
                  <label>Available Rooms</label>
                  <input
                    required type="number" min="0"
                    placeholder="e.g. 3"
                    value={addRoomForm.availableRooms}
                    onChange={(e) => setAddRoomForm((p) => ({ ...p, availableRooms: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="db-submit-btn">🛏️ Add Room</button>
            </form>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="db-table-wrap">
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
                {stats.recentBookings.map((b) => {
                  const sc = statusConfig[b.status] || statusConfig.confirmed;
                  return (
                    <tr key={b.id}>
                      <td className="db-mono">{b.id}</td>
                      <td>{b.guest}</td>
                      <td>
                        <strong>{b.hotel}</strong><br />
                        <span className="db-room-sub">{b.room}</span>
                      </td>
                      <td>{formatDate(b.checkIn)}</td>
                      <td>{formatDate(b.checkOut)}</td>
                      <td className="db-amount">₹{b.amount.toLocaleString()}</td>
                      <td>
                        <span className="db-status-badge" style={{ background: sc.bg, color: sc.color }}>
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
