import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Traveler.module.css";
import { loginUser, registerUser } from "./Hotels/api";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";


const Traveler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!isLogin && !formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (
      !isLogin &&
      !/^\d{10}$/.test(formData.contact.replace(/\D/g, ""))
    ) {
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
        resData = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Welcome back! You're now logged in.");
      } else {
        resData = await registerUser({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          phone: formData.contact,
        });
        toast.success("Account created successfully! Welcome to Sikkim Travel Guide.");
      }

      console.log(`${isLogin ? "Login" : "Signup"} successful:`, resData);

      const returnTo = location.state?.returnTo || "/";
      navigate(returnTo);
    } catch (error) {
      console.error("Authentication error:", error);
      let errMsg = error.response?.data?.message || error.message || "Authentication failed. Please try again.";

      // Improve error messages to be more specific and actionable
      if (errMsg.includes("Invalid email or password")) {
        errMsg = "Invalid email or password. Please check your credentials and try again.";
      } else if (errMsg.includes("Email already registered")) {
        errMsg = "This email is already registered. Please login or use a different email.";
      } else if (errMsg.includes("An error occurred")) {
        errMsg = "Unable to connect to the server. Please check your internet connection and try again.";
      }

      toast.error(errMsg);
      setErrors({
        general: errMsg,
      });
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
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      password: "",
    });
    setErrors({});
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Main Form Container */}
        <div className={styles.formContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>
              {isLogin ? "Sign In" : "Sign Up"}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>

            {/* First & Last Name Fields (Sign Up Only) */}
            {!isLogin && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <span className={styles.error}>{errors.firstName}</span>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.lastName ? styles.inputError : ""}`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <span className={styles.error}>{errors.lastName}</span>
                  )}
                </div>
              </>
            )}

            {/* Email Field */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                {isLogin && <Mail size={18} className={styles.inputIcon} />}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${isLogin ? styles.hasIcon : ""} ${errors.email ? styles.inputError : ""}`}
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
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
                  placeholder="Contact number"
                />
                {errors.contact && (
                  <span className={styles.error}>{errors.contact}</span>
                )}
              </div>
            )}

            {/* Password Field */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                {isLogin && <Lock size={18} className={styles.inputIcon} />}
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${styles.input} ${styles.passwordInput} ${isLogin ? styles.hasIcon : ""} ${errors.password ? styles.inputError : ""}`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}
            </div>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div className={styles.forgotPassword}>
                <button
                  type="button"
                  className={styles.forgotPasswordLink}
                  onClick={handleForgotPassword}
                >
                  Forgot password?
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
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>

            {/* Divider and Social Logins (Login Only) */}
            {isLogin && (
              <>
                <div className={styles.divider}>
                  <span>Or sign in with</span>
                </div>
                <button
                  type="button"
                  className={styles.googleButton}
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle size={22} />
                  Sign in with Google
                </button>
              </>
            )}

            {/* Toggle Form */}
            <div className={styles.toggleForm}>
              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={toggleForm}
              >
                {isLogin ? "Sign up" : "Log In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Traveler;
