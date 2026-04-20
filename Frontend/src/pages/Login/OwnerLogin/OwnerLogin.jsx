import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useOwnerAuth } from "../../../context/OwnerAuthContext";
import API from "../../../utils/api";
import styles from "./OwnerLogin.module.css";

const OwnerLogin = () => {
  const navigate = useNavigate();
  const { login } = useOwnerAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Login state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [documents, setDocuments] = useState([]);
  const [regLoading, setRegLoading] = useState(false);

  // Login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { data } = await API.post("/owner/login", loginForm);
      login(data.token, data.owner);
      toast.success("Welcome to Owner Dashboard");
      navigate("/owner/dashboard");
    } catch (err) {
      let errorMsg = "Unable to connect to the server. Please try again later.";
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        errorMsg = err.response.data?.message || "Invalid email or password.";
      }
      toast.error(errorMsg);
    } finally {
      setLoginLoading(false);
    }
  };

  /* ─── Register submit ─── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      const fd = new FormData();
      Object.entries(regForm).forEach(([k, v]) => fd.append(k, v));
      documents.forEach((f) => fd.append("documents", f));
      await API.post("/owner/register", fd, { headers: { "Content-Type": "multipart/form-data" } });
      
      toast.success("Registration submitted! Admin will review your application within 24-48 hours.");
      
      setRegForm({ name: "", email: "", password: "", phone: "" });
      setDocuments([]);
      setActiveTab("login"); // Optionally redirect to login tab on success
    } catch (err) {
      let errorMsg = "Unable to submit your registration. Please try again later.";
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        errorMsg = err.response.data?.message || "Registration failed. Try again.";
      }
      toast.error(errorMsg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Back button */}
        <button className={styles.backBtn} onClick={() => navigate("/login")}>
          ← Back
        </button>

        <div className={styles.logoSection}>
          <div className={styles.hotelIcon}>🏨</div>
          <h1 className={styles.title}>Hotel Owner Portal</h1>
          <p className={styles.subtitle}>Manage your hotels on Sikkim Travel Guide</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "login" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${activeTab === "register" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.fieldGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="owner@hotel.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loginLoading}>
              {loginLoading ? "Logging in..." : "Login to Dashboard"}
            </button>
            <p className={styles.switchText}>
              Don't have an account?{" "}
              <span onClick={() => setActiveTab("register")}>Register here</span>
            </p>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="owner@hotel.com"
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Business Documents <span className={styles.optional}>(optional — PDF/JPG/PNG)</span></label>
              <div className={styles.fileDropZone}>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  id="docs"
                  onChange={(e) => setDocuments(Array.from(e.target.files))}
                  style={{ display: "none" }}
                />
                <label htmlFor="docs" className={styles.fileLabel}>
                  📎 {documents.length > 0 ? `${documents.length} file(s) selected` : "Click to upload documents"}
                </label>
              </div>
            </div>
            <div className={styles.infoNote}>
               After registration, admin will review your application within 24-48 hours before granting access.
            </div>
            <button type="submit" className={styles.submitBtn} disabled={regLoading}>
              {regLoading ? "Submitting..." : "Submit Registration"}
            </button>
            <p className={styles.switchText}>
              Already registered?{" "}
              <span onClick={() => setActiveTab("login")}>Login here</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default OwnerLogin;
