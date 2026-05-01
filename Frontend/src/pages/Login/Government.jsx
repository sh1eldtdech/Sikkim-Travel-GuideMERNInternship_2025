import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGovAuth } from "../../context/GovAuthContext";
import API from "../../utils/api";
import { toast } from "react-toastify";
import styles from "./Government.module.css";

const Government = () => {
  const navigate = useNavigate();
  const { login } = useGovAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Login fields
    email: "",
    password: "",
    // Signup fields
    name: "",
    contact: "",
    department: "",
    designation: "",
    serviceNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (isLogin) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.password.trim()) newErrors.password = "Password is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    } else {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.contact.trim()) newErrors.contact = "Contact is required";
      if (!formData.department.trim()) newErrors.department = "Department is required";
      if (!formData.designation.trim()) newErrors.designation = "Designation is required";
      if (!formData.serviceNumber.trim()) newErrors.serviceNumber = "Service/Badge number is required";
      if (!formData.password.trim()) newErrors.password = "Password is required";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      const contactRegex = /^[0-9]{10}$/;
      if (formData.contact && !contactRegex.test(formData.contact)) {
        newErrors.contact = "Please enter a valid 10-digit contact number";
      }
      if (formData.password && formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError("");

    try {
      if (isLogin) {
        const { data } = await API.post("/gov/login", {
          email: formData.email,
          password: formData.password,
        });
        login(data.official);
        navigate("/government-dashboard");
      } else {
        const { data } = await API.post("/gov/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact,
          department: formData.department,
          designation: formData.designation,
          serviceNumber: formData.serviceNumber,
        });
        login(data.official);
        navigate("/government-dashboard");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "An error occurred. Please try again.";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      name: "",
      contact: "",
      department: "",
      designation: "",
      serviceNumber: "",
    });
    setErrors({});
    setServerError("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.backButton} onClick={() => navigate("/login")}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.logoContainer}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.logo}
            >
              <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" fill="currentColor"/>
              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>Government Agencies</h1>
          <p className={styles.subtitle}>
            {isLogin ? "Welcome back! Sign in to your account" : "Create your government account"}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleBtn} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.toggleBtn} ${!isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form Container */}
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {isLogin ? (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.email ? styles.error : ""}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.passwordContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.password ? styles.error : ""}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3L21 21M10.584 10.587A2 2 0 0 0 13.416 13.416M9.363 5.365A9.466 9.466 0 0 1 12 5C17 5 21 9 21 12A9.26 9.26 0 0 1 19.49 15.49M6.51 8.51A9.26 9.26 0 0 0 3 12C3 15 7 19 12 19A9.466 9.466 0 0 0 15.635 18.635" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>
              </>
            ) : (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.name ? styles.error : ""}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.email ? styles.error : ""}`}
                    placeholder="Enter your official email"
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Contact</label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.contact ? styles.error : ""}`}
                    placeholder="Enter your contact number"
                  />
                  {errors.contact && <span className={styles.errorText}>{errors.contact}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`${styles.input} ${styles.select} ${errors.department ? styles.error : ""}`}
                  >
                    <option value="">Select Department</option>
                    <option value="Tourism">Tourism</option>
                    <option value="Police">Police</option>
                    <option value="Disaster">Disaster Management</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Health">Health</option>
                    <option value="PWD">PWD (Roads)</option>
                    <option value="Forest">Forest Department</option>
                  </select>
                  {errors.department && <span className={styles.errorText}>{errors.department}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.designation ? styles.error : ""}`}
                    placeholder="Enter your designation"
                  />
                  {errors.designation && <span className={styles.errorText}>{errors.designation}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Service/Badge Number</label>
                  <input
                    type="text"
                    name="serviceNumber"
                    value={formData.serviceNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.serviceNumber ? styles.error : ""}`}
                    placeholder="Enter your service/badge number"
                  />
                  {errors.serviceNumber && <span className={styles.errorText}>{errors.serviceNumber}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.passwordContainer}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.password ? styles.error : ""}`}
                      placeholder="Create a password (min. 6 characters)"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3L21 21M10.584 10.587A2 2 0 0 0 13.416 13.416M9.363 5.365A9.466 9.466 0 0 1 12 5C17 5 21 9 21 12A9.26 9.26 0 0 1 19.49 15.49M6.51 8.51A9.26 9.26 0 0 0 3 12C3 15 7 19 12 19A9.466 9.466 0 0 0 15.635 18.635" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>
              </>
            )}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* Toggle Form */}
          <div className={styles.toggleContainer}>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button type="button" onClick={toggleForm}>
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Government;
