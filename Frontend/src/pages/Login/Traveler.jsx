import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Traveler.module.css";
import { loginUser, registerUser } from "./Hotels/api";

const Traveler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!isLogin && !formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!isLogin && !/^\d{10}$/.test(formData.contact.replace(/\D/g, ""))) {
      newErrors.contact = "Contact number must be 10 digits";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      let resData;
      if (isLogin) {
        resData = await loginUser({ email: formData.email, password: formData.password });
      } else {
        resData = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.contact,
        });
      }
      
      localStorage.setItem("token", resData.token);
      localStorage.setItem("user", JSON.stringify(resData.user));
      
      console.log(`${isLogin ? 'Login' : 'Signup'} successful:`, resData);
      
      const returnTo = location.state?.returnTo || "/";
      navigate(returnTo);
      
    } catch (error) {
      console.error("Authentication error:", error);
      setErrors({ general: error.message || "Authentication failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement Google OAuth
      console.log("Google Sign In clicked");
      // This would typically involve Google OAuth flow
    } catch (error) {
      console.error("Google Sign In error:", error);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log("Forgot password clicked");
    // This would typically navigate to forgot password page or show modal
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      contact: "",
      password: "",
    });
    setErrors({});
  };

  return (
    <div className={styles.container}>
      {/* Background with Sikkim-inspired gradient */}
      <div className={styles.backgroundOverlay}></div>
      
      <div className={styles.content}>
        {/* Back Button */}
        <button 
          className={styles.backButton}
          onClick={() => navigate("/login")}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Login Options
        </button>

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



        {/* Main Form Container */}
        <div className={styles.formContainer}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className={styles.title}>
              {isLogin ? "Welcome Back!" : "Join Us Today"}
            </h1>
            <p className={styles.subtitle}>
              {isLogin 
                ? "Sign in to continue your Sikkim adventure" 
                : "Create your account to explore Sikkim"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* General Error */}
            {errors.general && (
              <div className={styles.errorMessage}>
                {errors.general}
              </div>
            )}

            {/* Name Field (Sign Up Only) */}
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>
            )}

            {/* Email Field */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                placeholder="Enter your email"
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            {/* Contact Field (Sign Up Only) */}
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.contact ? styles.inputError : ""}`}
                  placeholder="Enter your contact number"
                />
                {errors.contact && <span className={styles.error}>{errors.contact}</span>}
              </div>
            )}

            {/* DOB Field (Sign Up Only) */}
{!isLogin && (
  <div className={styles.inputGroup}>
    <label className={styles.label}>Date of Birth</label>
    <input
      type="date"
      name="dob"
      value={formData.dob || ""}
      onChange={handleInputChange}
      className={`${styles.input} ${errors.dob ? styles.inputError : ""}`}
      max={new Date().toISOString().split("T")[0]}  // restrict future dates
      required
    />
    {errors.dob && <span className={styles.error}>{errors.dob}</span>}
  </div>
)}


            {/* Password Field */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ""}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.88 9.88C9.33 10.43 9 11.18 9 12C9 13.66 10.34 15 12 15C12.82 15 13.57 14.67 14.12 14.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.73 5.08C11.15 5.03 11.57 5 12 5C16 5 19.68 7.84 21 12C20.57 13.07 19.97 14.05 19.22 14.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.94 15.94C16.2 17.27 14.12 18 12 18C8 18 4.32 15.16 3 12C4.24 8.94 6.96 6.69 10.27 5.67" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span className={styles.error}>{errors.password}</span>}
            </div>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div className={styles.forgotPassword}>
                <button
                  type="button"
                  className={styles.forgotPasswordLink}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <div className={styles.spinner}></div>
              ) : (
                isLogin ? "Sign In" : "Sign Up"
              )}
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <span>or</span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleSignIn}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign {isLogin ? "in" : "up"} with Google
            </button>

            {/* Toggle Form */}
            <div className={styles.toggleForm}>
              <span>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={toggleForm}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Traveler;