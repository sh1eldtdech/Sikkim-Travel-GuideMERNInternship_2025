import React, { useState, useEffect } from "react";
import axios from "axios";

const UPISettings = () => {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchUPIDetails();
  }, []);

  const fetchUPIDetails = async () => {
    try {
      setFetching(true);
      const response = await API.get("/owner/upi-id");
      setUpiId(response.data.upiId || "");
    } catch (error) {
      console.error("Error fetching UPI details:", error);
      showMessage(
        "Failed to fetch UPI details",
        "error"
      );
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.put(
        "/owner/upi-id",
        { upiId }
      );

      showMessage("UPI ID updated successfully!", "success");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error updating UPI ID",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const validateUPIId = (value) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(value);
  };

  const isFormValid = () => {
    return upiId.trim() !== "" && validateUPIId(upiId);
  };

  if (fetching) {
    return (
      <div className="upi-settings loading">
        <div className="spinner"></div>
        <p>Loading UPI settings...</p>
      </div>
    );
  }

  return (
    <div className="upi-settings-container">
      <div className="upi-settings">
        <div className="settings-header">
          <h2>UPI Payment Settings</h2>
          <p className="subtitle">
            Configure your UPI ID to receive instant payouts for bookings
          </p>
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit} className="upi-form">
            <div className="form-group">
              <label htmlFor="upiId">
                UPI ID <span className="required">*</span>
              </label>
              <input
                type="text"
                id="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi or phone@bank"
                required
                className={`upi-input ${
                  upiId && !validateUPIId(upiId) ? "invalid" : ""
                }`}
              />
              <small className="help-text">
                Format: username@upi or phone@bank (e.g., john@okhdfcbank or
                9876543210@upi)
              </small>
              {upiId && !validateUPIId(upiId) && (
                <small className="error-text">Invalid UPI ID format</small>
              )}
            </div>

            {message && (
              <div
                className={`message ${messageType === "success" ? "success" : "error"}`}
              >
                <span className="message-icon">
                  {messageType === "success" ? "✓" : "⚠️"}
                </span>
                {message}
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className={`submit-button ${loading ? "loading" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  "Save UPI ID"
                )}
              </button>
            </div>
          </form>

          <div className="info-section">
            <h3>Why provide your UPI ID?</h3>
            <ul>
              <li>
                <span className="icon">⚡</span>
                <span>
                  <strong>Instant Payouts:</strong> Receive payments immediately
                  after booking confirmation
                </span>
              </li>
              <li>
                <span className="icon">🔒</span>
                <span>
                  <strong>Secure:</strong> Your UPI ID is encrypted and stored
                  securely
                </span>
              </li>
              <li>
                <span className="icon">💰</span>
                <span>
                  <strong>Direct Transfer:</strong> Money goes directly to your
                  UPI account
                </span>
              </li>
              <li>
                <span className="icon">📱</span>
                <span>
                  <strong>Easy Tracking:</strong> View all your payouts in the
                  dashboard
                </span>
              </li>
            </ul>

            <div className="warning-box">
              <h4>⚠️ Important Notes:</h4>
              <ul>
                <li>Make sure your UPI ID is active and linked to your bank account</li>
                <li>Double-check the UPI ID before saving</li>
                <li>You can update your UPI ID anytime from this page</li>
                <li>Payouts are processed automatically after successful payments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .upi-settings-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .upi-settings {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .upi-settings.loading {
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

        .settings-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }

        .settings-header h2 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }

        .subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .settings-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          padding: 30px;
        }

        .upi-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .required {
          color: #e74c3c;
        }

        .upi-input {
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s;
        }

        .upi-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .upi-input.invalid {
          border-color: #e74c3c;
        }

        .help-text {
          color: #666;
          font-size: 12px;
        }

        .error-text {
          color: #e74c3c;
          font-size: 12px;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .submit-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-button.loading .spinner {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        .info-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .info-section h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
        }

        .info-section ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }

        .info-section li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 14px;
          color: #555;
        }

        .icon {
          font-size: 20px;
        }

        .warning-box {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 15px;
        }

        .warning-box h4 {
          margin: 0 0 10px 0;
          color: #856404;
          font-size: 14px;
        }

        .warning-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .warning-box li {
          font-size: 13px;
          color: #856404;
          margin-bottom: 6px;
          padding-left: 20px;
          position: relative;
        }

        .warning-box li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #856404;
        }

        @media (max-width: 768px) {
          .settings-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default UPISettings;