import React, { useState, useEffect } from "react";
import axios from "axios";
import { getPayoutStatusColor, formatAmount } from "../../utils/razorpay";

const PayoutHistory = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPayout, setSelectedPayout] = useState(null);

  useEffect(() => {
    fetchPayouts();
  }, [page, statusFilter]);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("ownerToken");

      let url = `/api/owner/payouts?page=${page}&limit=10`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayouts(response.data.payouts);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      setError(
        error.response?.data?.message || "Failed to fetch payout history"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutClick = async (payoutId) => {
    try {
      const token = localStorage.getItem("ownerToken");
      const response = await axios.get(`/api/owner/payouts/${payoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPayout(response.data.payout);
    } catch (error) {
      console.error("Error fetching payout details:", error);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      completed: "success",
      processing: "info",
      pending: "warning",
      failed: "danger",
      reversed: "secondary",
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && payouts.length === 0) {
    return (
      <div className="payout-history loading">
        <div className="spinner"></div>
        <p>Loading payout history...</p>
      </div>
    );
  }

  return (
    <div className="payout-history-container">
      <div className="payout-history">
        <div className="history-header">
          <h2>Payout History</h2>
          <p className="subtitle">Track all your payouts and transactions</p>
        </div>

        <div className="history-controls">
          <div className="filter-section">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button
            onClick={fetchPayouts}
            className="refresh-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Refreshing...
              </>
            ) : (
              "Refresh"
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {payouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <h3>No Payouts Yet</h3>
            <p>
              {statusFilter
                ? `No payouts with status "${statusFilter}"`
                : "You haven't received any payouts yet. Payouts will appear here after successful bookings."}
            </p>
          </div>
        ) : (
          <>
            <div className="payouts-table-container">
              <table className="payouts-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Booking ID</th>
                    <th>Hotel</th>
                    <th>Amount</th>
                    <th>UPI ID</th>
                    <th>Status</th>
                    <th>UTR</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr
                      key={payout._id}
                      onClick={() => handlePayoutClick(payout._id)}
                      className="payout-row"
                    >
                      <td>{formatDate(payout.createdAt)}</td>
                      <td className="booking-id">
                        {payout.bookingId?._id?.slice(-8) || "N/A"}
                      </td>
                      <td>{payout.hotelId?.name || "N/A"}</td>
                      <td className="amount">{formatAmount(payout.amount)}</td>
                      <td className="upi-id">{payout.upiId}</td>
                      <td>{getStatusBadge(payout.status)}</td>
                      <td className="utr">{payout.utr || "N/A"}</td>
                      <td>
                        <button className="view-button">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1 || loading}
                  className="pagination-button"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages || loading}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {selectedPayout && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedPayout(null)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Payout Details</h3>
                <button
                  className="close-button"
                  onClick={() => setSelectedPayout(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <h4>Transaction Information</h4>
                  <div className="detail-row">
                    <span>Payout ID:</span>
                    <span>{selectedPayout._id}</span>
                  </div>
                  <div className="detail-row">
                    <span>Razorpay Payout ID:</span>
                    <span>
                      {selectedPayout.razorpayPayoutId || "N/A"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Amount:</span>
                    <span className="amount">
                      {formatAmount(selectedPayout.amount)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Status:</span>
                    <span>{getStatusBadge(selectedPayout.status)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Created At:</span>
                    <span>{formatDate(selectedPayout.createdAt)}</span>
                  </div>
                  {selectedPayout.processedAt && (
                    <div className="detail-row">
                      <span>Processed At:</span>
                      <span>{formatDate(selectedPayout.processedAt)}</span>
                    </div>
                  )}
                  {selectedPayout.utr && (
                    <div className="detail-row">
                      <span>UTR:</span>
                      <span>{selectedPayout.utr}</span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Booking Information</h4>
                  <div className="detail-row">
                    <span>Booking ID:</span>
                    <span>
                      {selectedPayout.bookingId?._id || "N/A"}
                    </span>
                  </div>
                  {selectedPayout.bookingId?.checkIn && (
                    <div className="detail-row">
                      <span>Check-in:</span>
                      <span>
                        {formatDate(selectedPayout.bookingId.checkIn)}
                      </span>
                    </div>
                  )}
                  {selectedPayout.bookingId?.totalAmount && (
                    <div className="detail-row">
                      <span>Booking Amount:</span>
                      <span className="amount">
                        {formatAmount(selectedPayout.bookingId.totalAmount)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Payment Information</h4>
                  <div className="detail-row">
                    <span>UPI ID:</span>
                    <span>{selectedPayout.upiId}</span>
                  </div>
                  <div className="detail-row">
                    <span>Mode:</span>
                    <span>{selectedPayout.mode}</span>
                  </div>
                  {selectedPayout.failureReason && (
                    <div className="detail-row">
                      <span>Failure Reason:</span>
                      <span className="error">
                        {selectedPayout.failureReason}
                      </span>
                    </div>
                  )}
                  {selectedPayout.retryCount > 0 && (
                    <div className="detail-row">
                      <span>Retry Attempts:</span>
                      <span>{selectedPayout.retryCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .payout-history-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .payout-history {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .payout-history.loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
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

        .history-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }

        .history-header h2 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }

        .subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .history-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .filter-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-section label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .filter-select {
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .refresh-button {
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .refresh-button:hover:not(:disabled) {
          background: #5568d3;
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-button .spinner {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        .error-message {
          margin: 20px 30px;
          padding: 12px 16px;
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .payouts-table-container {
          overflow-x: auto;
        }

        .payouts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .payouts-table thead {
          background: #f8f9fa;
        }

        .payouts-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #333;
          font-size: 14px;
          border-bottom: 2px solid #e0e0e0;
        }

        .payouts-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 14px;
        }

        .payout-row {
          cursor: pointer;
          transition: background 0.2s;
        }

        .payout-row:hover {
          background: #f8f9fa;
        }

        .booking-id {
          font-family: monospace;
          color: #666;
        }

        .amount {
          font-weight: 600;
          color: #10b981;
        }

        .upi-id {
          font-family: monospace;
          color: #666;
        }

        .utr {
          font-family: monospace;
          color: #666;
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

        .view-button {
          padding: 6px 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-button:hover {
          background: #5568d3;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
        }

        .pagination-button {
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .pagination-button:hover:not(:disabled) {
          background: #5568d3;
        }

        .pagination-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 14px;
          color: #666;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: #333;
        }

        .modal-body {
          padding: 20px;
        }

        .detail-section {
          margin-bottom: 20px;
        }

        .detail-section h4 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }

        .detail-row span:first-child {
          color: #666;
          font-weight: 500;
        }

        .detail-row span:last-child {
          color: #333;
          font-weight: 600;
        }

        .detail-row .amount {
          color: #10b981;
        }

        .detail-row .error {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .history-controls {
            flex-direction: column;
            gap: 15px;
          }

          .payouts-table {
            font-size: 12px;
          }

          .payouts-table th,
          .payouts-table td {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default PayoutHistory;