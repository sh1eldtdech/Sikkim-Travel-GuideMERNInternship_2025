import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerAuth } from "../../../context/OwnerAuthContext";
import API from "../../../utils/api";
import styles from "./OwnerDashboard.module.css";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { owner, logout } = useOwnerAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/bookings/owner/bookings");
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cards = [
    { icon: "🏨", label: "My Hotels", desc: "View and manage listed hotels", path: "/owner/my-hotels", color: "#667eea" },
    { icon: "➕", label: "Add New Hotel", desc: "List a new hotel property", path: "/owner/add-hotel", color: "#48bb78" },
    { icon: "📋", label: "Bookings", desc: "View all guest bookings", path: "/owner/bookings", color: "#ed8936" },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.greeting}>Welcome back, {owner?.name || "Owner"} 👋</h1>
          <p className={styles.subGreet}>Here's your hotel portfolio overview</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </header>

      {/* Stats Row */}
      {!loading && stats && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div>
              <div className={styles.statNum}>{stats.totalBookings}</div>
              <div className={styles.statLabel}>Total Bookings</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div>
              <div className={styles.statNum}>{stats.confirmed}</div>
              <div className={styles.statLabel}>Confirmed</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div>
              <div className={styles.statNum}>₹{stats.totalRevenue.toLocaleString("en-IN")}</div>
              <div className={styles.statLabel}>Total Revenue</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔜</div>
            <div>
              <div className={styles.statNum}>{stats.upcoming}</div>
              <div className={styles.statLabel}>Upcoming</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Cards */}
      <div className={styles.navCards}>
        {cards.map((c) => (
          <div key={c.label} className={styles.navCard} onClick={() => navigate(c.path)} style={{ "--accent": c.color }}>
            <div className={styles.navIcon}>{c.icon}</div>
            <h3 className={styles.navLabel}>{c.label}</h3>
            <p className={styles.navDesc}>{c.desc}</p>
            <div className={styles.navArrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;
