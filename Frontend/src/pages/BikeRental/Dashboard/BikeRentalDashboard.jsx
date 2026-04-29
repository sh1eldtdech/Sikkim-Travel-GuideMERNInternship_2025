import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBikeOwnerAuth } from "../../../context/BikeOwnerAuthContext";
import API from "../../../utils/api";
import {
  Bike,
  PlusCircle,
  ClipboardList,
  LogOut,
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import PageContainer from "../../../components/PageContainer/PageContainer";

const BikeRentalDashboard = () => {
  const navigate = useNavigate();
  const { bikeOwner, logout } = useBikeOwnerAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/bikes/owner/my-bikes");
        const bikes = data.bikes || [];
        setStats({
          total: bikes.length,
          active: bikes.filter((b) => b.isActive && b.isApproved).length,
          pending: bikes.filter((b) => !b.isApproved).length,
        });
      } catch {
        // Stats are non-critical for rendering the dashboard.
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navCards = [
    {
      label: "My Bikes",
      desc: "View, edit, and manage your listed bikes",
      path: "/owner/bike-rental/my-bikes",
      icon: <Bike size={28} />,
      tone: "orange",
    },
    {
      label: "List New Bike",
      desc: "Expand your fleet by adding a new bike",
      path: "/owner/bike-rental/add-bike",
      icon: <PlusCircle size={28} />,
      tone: "green",
    },
    {
      label: "Bookings",
      desc: "Track and manage customer reservations",
      path: "/owner/bike-rental/bookings",
      icon: <ClipboardList size={28} />,
      tone: "blue",
    },
  ];

  const statCards = [
    {
      label: "Total Bikes",
      val: stats.total,
      icon: <Package size={24} />,
      tone: "orange",
    },
    {
      label: "Active Listings",
      val: stats.active,
      icon: <CheckCircle size={24} />,
      tone: "green",
    },
    {
      label: "Pending Approval",
      val: stats.pending,
      icon: <Clock size={24} />,
      tone: "amber",
    },
  ];

  return (
    <PageContainer size="wide" bottom="compact">
      <section className="bike-dashboard">
        <div className="bike-dashboard__header">
          <div className="bike-dashboard__title-block">
            <div className="bike-dashboard__brand-icon">
              <Bike size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="bike-dashboard__title">Rental Dashboard</h1>
              <p className="bike-dashboard__subtitle">
                Sikkim Travel Guide Business
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="bike-dashboard__logout"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="bike-dashboard__hero">
          <div className="bike-dashboard__hero-mark">
            <TrendingUp size={120} />
          </div>
          <div className="bike-dashboard__hero-content">
            <div className="bike-dashboard__pill">
              <span />
              Partner Portal
            </div>
            <h2 className="bike-dashboard__hero-title">
              Welcome back, {bikeOwner?.name || "Partner"}!
            </h2>
            <p className="bike-dashboard__hero-copy">
              Manage your bike fleet, track your business performance, and
              expand your reach across Sikkim from your unified dashboard.
            </p>
          </div>
        </div>

        <div className="bike-dashboard__stats">
          {statCards.map((s) => (
            <div key={s.label} className="bike-dashboard__stat-card">
              <div
                className={`bike-dashboard__stat-icon bike-dashboard__stat-icon--${s.tone}`}
              >
                {s.icon}
              </div>
              <div>
                <div className="bike-dashboard__stat-value">
                  {loading ? (
                    <span className="bike-dashboard__loading">-</span>
                  ) : (
                    s.val
                  )}
                </div>
                <div className="bike-dashboard__stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bike-dashboard__actions">
          <h3 className="bike-dashboard__section-title">Quick Actions</h3>
          <div className="bike-dashboard__action-grid">
            {navCards.map((c) => (
              <div
                key={c.label}
                onClick={() => navigate(c.path)}
                className="bike-dashboard__action-card"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate(c.path);
                }}
              >
                <div
                  className={`bike-dashboard__action-glow bike-dashboard__action-glow--${c.tone}`}
                />
                <div
                  className={`bike-dashboard__action-icon bike-dashboard__action-icon--${c.tone}`}
                >
                  {c.icon}
                </div>
                <h3 className="bike-dashboard__action-title">{c.label}</h3>
                <p className="bike-dashboard__action-copy">{c.desc}</p>
                <div
                  className={`bike-dashboard__action-link bike-dashboard__action-link--${c.tone}`}
                >
                  Manage <span>-&gt;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default BikeRentalDashboard;
