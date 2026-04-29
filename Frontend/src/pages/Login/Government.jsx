import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Government.module.css";

const Government = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Login fields
    fullName: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isLogin) {
      // Login validation
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.password.trim()) newErrors.password = "Password is required";
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    } else {
      // Signup validation
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.contact.trim()) newErrors.contact = "Contact is required";
      if (!formData.department.trim()) newErrors.department = "Department is required";
      if (!formData.designation.trim()) newErrors.designation = "Designation is required";
      if (!formData.serviceNumber.trim()) newErrors.serviceNumber = "Service/Badge number is required";
      if (!formData.password.trim()) newErrors.password = "Password is required";

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      // Contact validation
      const contactRegex = /^[0-9]{10}$/;
      if (formData.contact && !contactRegex.test(formData.contact)) {
        newErrors.contact = "Please enter a valid 10-digit contact number";
      }

      // Password validation
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
    
    try {
      // Prepare data for backend
      const submitData = isLogin 
        ? {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            contact: formData.contact,
            department: formData.department,
            designation: formData.designation,
            serviceNumber: formData.serviceNumber,
            password: formData.password,
          };

      console.log("Data to be sent to backend:", submitData);
      
      // Simulate API call (remove this when connecting to real backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show success message
      alert(`${isLogin ? "Login" : "Signup"} successful! (This is a demo - connect to your backend)`);
      
      // Navigate to dashboard or home page after successful login/signup
      navigate("/government-dashboard");
      
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("Google Sign In clicked - connect to your backend");
      // This is where you'll implement Google OAuth
      // You can use libraries like @google-oauth/client or similar
      alert("Google Sign In - Connect to your backend with Google OAuth");
    } catch (error) {
      console.error("Google Sign In error:", error);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page or show modal
    alert("Forgot password - implement this feature with your backend");
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      name: "",
      contact: "",
      department: "",
      designation: "",
      serviceNumber: "",
    });
    setErrors({});
  };

  return (
    <div className={styles.container}>
      {/* Background */}
      <div className={styles.backgroundOverlay}></div>


      

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.backButton} onClick={() => navigate("/login")}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>            <div className={styles.backButton} onClick={() => navigate("/login")}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.backButtonText}>
                
              </span>
            </div>
          </div>
          <div className={styles.logoContainer}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.logo}
            >
              <path
                d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"
                fill="currentColor"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className={styles.title}>
            Government Agencies
          </h1>
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
            <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {isLogin ? (
              // Login Form
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.fullName ? styles.error : ""}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                </div>

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

                <div className={styles.forgotPassword}>
                  <button type="button" onClick={handleForgotPassword}>
                    Forgot Password?
                  </button>
                </div>
              </>
            ) : (
              // Signup Form
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.name ? styles.error : ""}`}
                    placeholder="Enter your name"
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
                    placeholder="Enter your email"
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
                      placeholder="Create a password"
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
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Google Sign In - Only show for signup */}
          {!isLogin && (
            <div className={styles.googleContainer}>
              <div className={styles.divider}>
                <span>Or</span>
              </div>
              <button type="button" className={styles.googleButton} onClick={handleGoogleSignIn}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}

          {/* Toggle Form */}
          <div className={styles.toggleContainer}>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button type="button" onClick={toggleForm}>
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Government;


