import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatAmount } from "../../../utils/razorpay";

const OwnerDashboardEnhanced = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("ownerToken");

      const response = await axios.get("/api/owner/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDashboardData(response.data.dashboard);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatCard = (title, value, icon, color) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const colors = {
      completed: "success",
      processing: "info",
      pending: "warning",
      failed: "danger",
    };

    return (
      <span className={`status-badge ${colors[status] || "secondary"}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="owner-dashboard-enhanced loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="owner-dashboard-enhanced error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to load dashboard</h3>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const { owner, bookingStats, payoutStats, recentBookings, recentPayouts } =
    dashboardData;

  // Calculate totals from stats
  const totalBookings = bookingStats?.reduce((sum, stat) => sum + stat.count, 0) || 0;
  const totalRevenue = bookingStats?.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0) || 0;
  const totalPayouts = payoutStats?.reduce((sum, stat) => sum + stat.count, 0) || 0;
  const totalPayoutAmount = payoutStats?.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0) || 0;

  return (
    <div className="owner-dashboard-enhanced-container">
      <div className="owner-dashboard-enhanced">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Payment & Payout Dashboard</h1>
            <p className="welcome-text">
              Welcome back, {owner.name}!
            </p>
          </div>
          <div className="header-actions">
            <div className={`upi-status ${owner.upiConfigured ? "configured" : "not-configured"}`}>
              <span className="status-icon">
                {owner.upiConfigured ? "✓" : "⚠️"}
              </span>
              <span className="status-text">
                {owner.upiConfigured ? "UPI Configured" : "UPI Not Configured"}
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
          <button
            className={`tab-button ${activeTab === "payouts" ? "active" : ""}`}
            onClick={() => setActiveTab("payouts")}
          >
            Payouts
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="tab-content overview">
            <div className="stats-grid">
              {getStatCard("Total Bookings", totalBookings, "📊", "blue")}
              {getStatCard("Total Revenue", formatAmount(totalRevenue), "💰", "green")}
              {getStatCard("Total Payouts", totalPayouts, "💸", "purple")}
              {getStatCard("Payout Amount", formatAmount(totalPayoutAmount), "🏦", "orange")}
            </div>

            <div className="dashboard-sections">
              <div className="section recent-bookings">
                <h3>Recent Bookings</h3>
                {recentBookings.length === 0 ? (
                  <div className="empty-state">
                    <p>No recent bookings</p>
                  </div>
                ) : (
                  <div className="list-container">
                    {recentBookings.map((booking) => (
                      <div key={booking._id} className="list-item">
                        <div className="item-info">
                          <div className="item-title">
                            {booking.hotel?.name || "Unknown Hotel"}
                          </div>
                          <div className="item-subtitle">
                            {booking.user?.name || "Guest"} •{" "}
                            {formatDate(booking.createdAt)}
                          </div>
                        </div>
                        <div className="item-amount">
                          {formatAmount(booking.totalAmount)}
                        </div>
                        <div className="item-status">
                          {getStatusBadge(booking.paymentStatus)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="section recent-payouts">
                <h3>Recent Payouts</h3>
                {recentPayouts.length === 0 ? (
                  <div className="empty-state">
                    <p>No recent payouts</p>
                  </div>
                ) : (
                  <div className="list-container">
                    {recentPayouts.map((payout) => (
                      <div key={payout._id} className="list-item">
                        <div className="item-info">
                          <div className="item-title">
                            Booking #{payout.bookingId?._id?.slice(-8) || "N/A"}
                          </div>
                          <div className="item-subtitle">
                            {formatDate(payout.createdAt)}
                          </div>
                        </div>
                        <div className="item-amount">
                          {formatAmount(payout.amount)}
                        </div>
                        <div className="item-status">
                          {getStatusBadge(payout.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {!owner.upiConfigured && (
              <div className="alert-box warning">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">
                  <h4>Configure Your UPI ID</h4>
                  <p>
                    To receive instant payouts for your bookings, please configure
                    your UPI ID in the settings.
                  </p>
                  <button
                    className="action-button"
                    onClick={() => window.location.href = "/owner/upi-settings"}
                  >
                    Configure UPI ID
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="tab-content bookings">
            <div className="section-header">
              <h3>Booking Statistics</h3>
            </div>
            <div className="stats-breakdown">
              {bookingStats?.map((stat) => (
                <div key={stat._id} className="stat-breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-status">
                      {getStatusBadge(stat._id)}
                    </span>
                    <span className="breakdown-count">{stat.count} bookings</span>
                  </div>
                  <div className="breakdown-amount">
                    {formatAmount(stat.totalAmount || 0)}
                  </div>
                </div>
              )) || <div className="empty-state">No booking data available</div>}
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="tab-content payouts">
            <div className="section-header">
              <h3>Payout Statistics</h3>
            </div>
            <div className="stats-breakdown">
              {payoutStats?.map((stat) => (
                <div key={stat._id} className="stat-breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-status">
                      {getStatusBadge(stat._id)}
                    </span>
                    <span className="breakdown-count">{stat.count} payouts</span>
                  </div>
                  <div className="breakdown-amount">
                    {formatAmount(stat.totalAmount || 0)}
                  </div>
                </div>
              )) || <div className="empty-state">No payout data available</div>}
            </div>

            <div className="payout-summary">
              <h4>Payout Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Total Payouts</span>
                  <span className="summary-value">
                    {owner.payoutDetails?.totalPayouts || 0}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">
                    {formatAmount(owner.payoutDetails?.totalPayoutAmount || 0)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Last Payout</span>
                  <span className="summary-value">
                    {owner.payoutDetails?.lastPayoutDate
                      ? formatDate(owner.payoutDetails.lastPayoutDate)
                      : "Never"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .owner-dashboard-enhanced-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .owner-dashboard-enhanced {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .owner-dashboard-enhanced.loading,
        .owner-dashboard-enhanced.error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .retry-button {
          padding: 10px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 20px;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h1 {
          margin: 0 0 5px 0;
          font-size: 28px;
        }

        .welcome-text {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .upi-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .upi-status.configured {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .upi-status.not-configured {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .dashboard-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .tab-button {
          padding: 15px 30px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 3px solid transparent;
        }

        .tab-button:hover {
          color: #333;
        }

        .tab-button.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .tab-content {
          padding: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          padding: 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
        }

        .stat-card.blue {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .stat-card.green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .stat-card.purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .stat-card.orange {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-title {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
        }

        .dashboard-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .section h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 18px;
        }

        .list-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          gap: 12px;
        }

        .item-info {
          flex: 1;
        }

        .item-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .item-subtitle {
          font-size: 12px;
          color: #666;
        }

        .item-amount {
          font-weight: 700;
          color: #10b981;
          font-size: 16px;
        }

        .item-status {
          flex-shrink: 0;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.success {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.info {
          background: #d1ecf1;
          color: #0c5460;
        }

        .status-badge.warning {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.danger {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.secondary {
          background: #e2e3e5;
          color: #383d41;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .alert-box {
          margin-top: 30px;
          padding: 20px;
          border-radius: 8px;
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }

        .alert-box.warning {
          background: #fff3cd;
          border: 1px solid #ffc107;
        }

        .alert-icon {
          font-size: 24px;
        }

        .alert-content h4 {
          margin: 0 0 8px 0;
          color: #856404;
        }

        .alert-content p {
          margin: 0 0 12px 0;
          color: #856404;
          font-size: 14px;
        }

        .action-button {
          padding: 8px 16px;
          background: #856404;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .section-header {
          margin-bottom: 20px;
        }

        .section-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .stats-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-breakdown-item {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .breakdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .breakdown-count {
          font-size: 14px;
          color: #666;
        }

        .breakdown-amount {
          font-size: 20px;
          font-weight: 700;
          color: #10b981;
        }

        .payout-summary {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .payout-summary h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .summary-label {
          font-size: 12px;
          color: #666;
        }

        .summary-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .dashboard-sections {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .list-item {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default OwnerDashboardEnhanced;