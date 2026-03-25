import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./OwnerLogin.css";

export function OwnerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Real: const res = await fetch("/owner/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.message);
      // localStorage.setItem("ownerToken", data.token);

      // Simulated login
      await new Promise((r) => setTimeout(r, 1000));
      if (form.email && form.password) {
        localStorage.setItem("ownerToken", "owner_token_demo");
        navigate("/owner/dashboard");
      } else {
        throw new Error("Please fill in all fields");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ol-page">
      <div className="ol-card">
        <div className="ol-left">
          <div className="ol-left-content">
            <div className="ol-brand">🏔️ Sikkim Tourism</div>
            <h2 className="ol-left-title">Manage Your Properties</h2>
            <p className="ol-left-sub">Access your owner dashboard to manage hotels, rooms, and bookings in real time.</p>
            <div className="ol-features">
              <div className="ol-feature">✓ Real-time room availability</div>
              <div className="ol-feature">✓ Instant booking notifications</div>
              <div className="ol-feature">✓ Revenue analytics</div>
            </div>
          </div>
        </div>
        <div className="ol-right">
          <h1 className="ol-title">Owner Login</h1>
          <p className="ol-sub">Welcome back! Access your dashboard</p>

          {error && <div className="ol-error">{error}</div>}

          <form onSubmit={handleSubmit} className="ol-form">
            <div className="ol-form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                placeholder="owner@hotel.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="ol-form-group">
              <label>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>
            <button type="submit" className="ol-submit" disabled={loading}>
              {loading ? <span className="ol-spinner" /> : "Login to Dashboard →"}
            </button>
          </form>

          <p className="ol-footer-text">
            Not registered yet? <Link to="/owner/register" className="ol-link">Register as Hotel Owner</Link>
          </p>
          <p className="ol-footer-text">
            <Link to="/" className="ol-link">← Back to Tourist View</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function OwnerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Real: upload docs, then POST /owner/register with FormData
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="ol-page">
        <div className="ol-success-card">
          <div className="ol-success-icon">📋</div>
          <h2>Registration Submitted!</h2>
          <p>Your application has been submitted for admin review. You will receive login access once verified (typically within 24-48 hours).</p>
          <Link to="/owner/login" className="ol-success-btn">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ol-page">
      <div className="ol-card reg">
        <div className="ol-left">
          <div className="ol-left-content">
            <div className="ol-brand">🏔️ Sikkim Tourism</div>
            <h2 className="ol-left-title">Join as a Hotel Owner</h2>
            <p className="ol-left-sub">List your property and reach thousands of tourists visiting Sikkim every year.</p>
            <div className="ol-steps-list">
              <div className="ol-step"><span>1</span> Submit registration & documents</div>
              <div className="ol-step"><span>2</span> Admin reviews & verifies</div>
              <div className="ol-step"><span>3</span> Access your dashboard</div>
              <div className="ol-step"><span>4</span> Start receiving bookings</div>
            </div>
          </div>
        </div>
        <div className="ol-right">
          <h1 className="ol-title">Register as Owner</h1>
          <p className="ol-sub">Fill in your details to apply</p>

          <form onSubmit={handleSubmit} className="ol-form">
            <div className="ol-form-group">
              <label>Full Name</label>
              <input required placeholder="Your full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="ol-form-group">
              <label>Email Address</label>
              <input required type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="ol-form-group">
              <label>Phone Number</label>
              <input required placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="ol-form-group">
              <label>Password</label>
              <input required type="password" placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="ol-form-group">
              <label>Business Documents (Trade License / ID Proof)</label>
              <div className="ol-file-upload">
                <input type="file" id="docs" accept=".pdf,.jpg,.png" multiple onChange={(e) => setDocs(e.target.files)} />
                <label htmlFor="docs" className="ol-file-label">
                  {docs ? `${docs.length} file(s) selected` : "📎 Click to upload documents"}
                </label>
              </div>
            </div>
            <button type="submit" className="ol-submit" disabled={loading}>
              {loading ? <span className="ol-spinner" /> : "Submit Application →"}
            </button>
          </form>

          <p className="ol-footer-text">
            Already registered? <Link to="/owner/login" className="ol-link">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
