import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useOwnerAuth } from "../../../context/OwnerAuthContext";
import { useBikeOwnerAuth } from "../../../context/BikeOwnerAuthContext";
import API from "../../../utils/api";
import styles from "./OwnerLogin.module.css";

/* ── Business type definitions ─────────────────────────────────────── */
const BUSINESS_TYPES = [
  { value: "hotel",       label: "Hotel" },
  { value: "bike-rental", label: "Bike Rental" },
];

/** Post-login dashboard route based on business type */
const getDashboardRoute = (type) =>
  type === "bike-rental" ? "/owner/bike-rental/dashboard" : "/owner/hotel/dashboard";

/* ── Custom Select Dropdown ─────────────────────────────────────────── */
const BusinessTypeSelect = ({ value, onChange, required }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = BUSINESS_TYPES.find((b) => b.value === value);

  return (
    <div className={styles.selectWrapper} ref={ref}>
      <button
        type="button"
        className={`${styles.selectTrigger} ${open ? styles.selectOpen : ""} ${!value ? styles.selectPlaceholder : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : "Select Business Type"}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronUp : ""}`}>▾</span>
      </button>

      {open && (
        <ul className={styles.selectDropdown} role="listbox">
          {BUSINESS_TYPES.map((b) => (
            <li
              key={b.value}
              role="option"
              aria-selected={value === b.value}
              className={`${styles.selectOption} ${value === b.value ? styles.selectedOption : ""}`}
              onClick={() => { onChange(b.value); setOpen(false); }}
            >
              {b.label}
            </li>
          ))}
        </ul>
      )}

      {/* Hidden native select for form required validation */}
      <select
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }}
        value={value}
        onChange={() => {}}
        required={required}
      >
        <option value="" />
        {BUSINESS_TYPES.map((b) => <option key={b.value} value={b.value} />)}
      </select>
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────────────────── */
const OwnerLogin = () => {
  const navigate = useNavigate();

  // Two separate auth contexts — one per business entity
  const { login: hotelLogin } = useOwnerAuth();
  const { login: bikeOwnerLogin } = useBikeOwnerAuth();

  const [activeTab, setActiveTab] = useState("login");

  /* Login state */
  const [loginForm, setLoginForm] = useState({ email: "", password: "", businessType: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  /* Register state */
  const [regForm, setRegForm] = useState({
    name: "", email: "", password: "", phone: "", businessType: "",
  });
  const [documents, setDocuments] = useState([]);
  const [regLoading, setRegLoading] = useState(false);

  /* ─── LOGIN ─── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.businessType) {
      toast.warning("Please select your Business Type.");
      return;
    }

    setLoginLoading(true);
    try {
      const isHotel = loginForm.businessType === "hotel";

      // Each business type calls a DIFFERENT backend endpoint
      const endpoint = isHotel ? "/owner/login" : "/bike-owner/login";
      const { data } = await API.post(endpoint, {
        email: loginForm.email,
        password: loginForm.password,
      });

      if (isHotel) {
        // Store in hotel owner context (ownerToken)
        hotelLogin(data.token, { ...data.owner, businessType: "hotel" });
      } else {
        // Store in bike owner context (bikeOwnerToken)
        bikeOwnerLogin(data.token, {
          ...data.bikeOwner,
          businessType: "bike-rental",
        });
      }

      toast.success("Welcome to your Business Dashboard!");

      // Small delay to let React state propagate before navigation
      setTimeout(() => {
        navigate(getDashboardRoute(loginForm.businessType));
      }, 100);
    } catch (err) {
      let msg = "Unable to connect to the server. Please try again later.";
      if (err.response?.status >= 400 && err.response?.status < 500) {
        msg = err.response.data?.message;
        if (msg === "Invalid email or password") {
          msg = "account dosen't exist try signin";
        } else {
          msg = msg || "account dosen't exists try signin";
        }
      }
      toast.error(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  /* ─── REGISTER ─── */
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.businessType) {
      toast.warning("Please select your Business Type.");
      return;
    }

    setRegLoading(true);
    try {
      const isHotel = regForm.businessType === "hotel";

      // Each business type registers at a DIFFERENT backend endpoint
      const endpoint = isHotel ? "/owner/register" : "/bike-owner/register";

      const fd = new FormData();
      const { businessType, ...formFields } = regForm;
      Object.entries(formFields).forEach(([k, v]) => fd.append(k, v));
      documents.forEach((f) => fd.append("documents", f));

      await API.post(endpoint, fd, { headers: { "Content-Type": "multipart/form-data" } });

      toast.success(
        `${isHotel ? "Hotel" : "Bike Rental"} registration submitted! Admin will review your application within 24-48 hours.`
      );
      setRegForm({ name: "", email: "", password: "", phone: "", businessType: "" });
      setDocuments([]);
      setActiveTab("login");
    } catch (err) {
      let msg = "Unable to submit your registration. Please try again later.";
      if (err.response?.status >= 400 && err.response?.status < 500) {
        msg = err.response.data?.message || "Registration failed. Try again.";
      }
      toast.error(msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Back button */}
        <button className={styles.backBtn} onClick={() => navigate("/login")}>
          Back
        </button>

        <div className={styles.logoSection}>
          <h1 className={styles.title}>Business Portal</h1>
          <p className={styles.subtitle}>
            {loginForm.businessType === "bike-rental" || regForm.businessType === "bike-rental"
              ? "Manage your bike rental fleet on Sikkim Travel Guide"
              : "Manage your business on Sikkim Travel Guide"}
          </p>
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

        {/* ── Login Form ── */}
        {activeTab === "login" && (
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.fieldGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="owner@business.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label>Select Business Type</label>
              <BusinessTypeSelect
                value={loginForm.businessType}
                onChange={(val) => setLoginForm({ ...loginForm, businessType: val })}
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

        {/* ── Register Form ── */}
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
                placeholder="owner@business.com"
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
              <label>Select Business Type</label>
              <BusinessTypeSelect
                value={regForm.businessType}
                onChange={(val) => setRegForm({ ...regForm, businessType: val })}
                required
              />
            </div>

            {/* Info note */}
            {regForm.businessType && (
              <div className={styles.infoNote}>
                {regForm.businessType === "hotel"
                  ? "Admin will review and approve your hotel listing within 48 hours."
                  : "Admin will review and approve your bike rental business within 48 hours."}
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label>
                Business Documents <span className={styles.optional}>(optional - PDF/JPG/PNG)</span>
              </label>
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
                  {documents.length > 0
                    ? `${documents.length} file(s) selected`
                    : "Click to upload documents"}
                </label>
              </div>
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
