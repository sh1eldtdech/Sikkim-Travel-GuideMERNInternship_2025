import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../utils/api";
import styles from "./OwnerBookings.module.css";

const STATUS_COLORS = {
  confirmed: "#68d391",
  upcoming: "#63b3ed",
  completed: "#a78bfa",
  cancelled: "#fc8181",
};

const OwnerBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/bookings/owner/bookings");
        setBookings(data.bookings);
        setStats(data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const fmt = (date) =>
    new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/owner/dashboard")}>← Dashboard</button>
        <h1 className={styles.title}>Guest Bookings</h1>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {/* Stats */}
      {stats && (
        <div className={styles.statsRow}>
          {[
            { label: "Total", val: stats.totalBookings, icon: "📦", key: "all" },
            { label: "Confirmed", val: stats.confirmed, icon: "✅", key: "confirmed" },
            { label: "Upcoming", val: stats.upcoming, icon: "🔜", key: "upcoming" },
            { label: "Completed", val: stats.completed, icon: "🏁", key: "completed" },
            { label: "Cancelled", val: stats.cancelled, icon: "❌", key: "cancelled" },
            { label: "Revenue", val: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: "💰", key: null },
          ].map((s) => (
            <div
              key={s.label}
              className={`${styles.statCard} ${filter === s.key ? styles.activeStatCard : ""}`}
              onClick={() => s.key !== null && setFilter(s.key)}
              style={{ cursor: s.key !== null ? "pointer" : "default" }}
            >
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statVal}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterRow}>
        {["all", "confirmed", "upcoming", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingState}><div className={styles.spinner}></div><p>Loading bookings...</p></div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>📭</span>
          <p>No {filter === "all" ? "" : filter} bookings found</p>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.thead}>
            <span>Guest</span>
            <span>Hotel / Room</span>
            <span>Dates</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {filtered.map((b) => (
            <div key={b._id} className={styles.trow}>
              <div className={styles.guestCell}>
                <div className={styles.guestName}>{b.user?.name || "—"}</div>
                <div className={styles.guestEmail}>{b.user?.email || ""}</div>
                <div className={styles.guestPhone}>{b.user?.phone || ""}</div>
              </div>
              <div className={styles.hotelCell}>
                <div className={styles.hotelName}>{b.hotel?.name || b.hotelName || "—"}</div>
                <div className={styles.roomType}>{b.room?.roomType || b.roomType || ""}</div>
              </div>
              <div className={styles.datesCell}>
                <div>{fmt(b.checkIn)}</div>
                <div className={styles.dateDivider}>→</div>
                <div>{fmt(b.checkOut)}</div>
                <div className={styles.nights}>{b.nights} night{b.nights !== 1 ? "s" : ""}</div>
              </div>
              <div className={styles.amountCell}>
                <div className={styles.amount}>₹{b.totalAmount.toLocaleString("en-IN")}</div>
                <div className={styles.payStatus}>{b.paymentStatus}</div>
              </div>
              <div className={styles.statusCell}>
                <span
                  className={styles.statusBadge}
                  style={{ color: STATUS_COLORS[b.status] || "#fff", borderColor: STATUS_COLORS[b.status] || "rgba(255,255,255,0.2)" }}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
