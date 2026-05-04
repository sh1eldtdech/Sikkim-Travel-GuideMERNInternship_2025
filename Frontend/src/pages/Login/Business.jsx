import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { useOwnerAuth } from "../../context/OwnerAuthContext";
import { toast } from "react-toastify";
import styles from "./Business.module.css";

const Business = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Auth Context
  const { login } = useOwnerAuth();

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    contactNo: "",
    tourismService: "",
    businessName: "",
    password: "",
    confirmPassword: "",
  });

  const tourismServices = [
    "Hotel",
    "Resort",
    "Homestay",
    "Hostel",
    "Restaurant",
    "Cafes",
    "Bike Rental",
    "Taxi / Cab Services",
    "Travel & Tourism",
    "Hire Tour Guide",
    "Media",
    "Adventure Sports",
  ];

  const businessTypes = [
    "Solo Partnership",
    "Sikkim Registered",
    "Central Registered",
  ];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await API.post("/owner/login", {
        email: loginData.email,
        password: loginData.password,
      });
      login({ ...response.data.owner, businessType: "hotel" });
      toast.success("Welcome back! You're now logged in to your business dashboard.");
      navigate("/owner/dashboard");
    } catch (err) {
      let msg = err.response?.data?.message || "Login failed. Please try again.";

      // Improve error messages to be more specific and actionable
      if (msg.includes("Invalid email or password")) {
        msg = "Invalid email or password. Please check your credentials and try again.";
      } else if (msg.includes("pending")) {
        msg = "Your account is pending admin approval. Please check back in 24-48 hours.";
      } else if (msg.includes("rejected")) {
        msg = "Your account has been rejected. Please contact support for more information.";
      } else if (msg.includes("An error occurred")) {
        msg = "Unable to connect to the server. Please check your internet connection and try again.";
      }

      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (signupData.password !== signupData.confirmPassword) {
      const msg = "Passwords do not match. Please ensure both passwords are identical.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.contactNo,
        password: signupData.password,
      };

      await API.post("/owner/register", submitData);

      const successMessage = "Registration successful! Admin will review your application within 24-48 hours.";
      setSuccessMsg(successMessage);
      toast.success(successMessage);

      setSignupData({
        name: "",
        email: "",
        contactNo: "",
        tourismService: "",
        businessName: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setIsLogin(true);
        setSuccessMsg("");
      }, 5000);
    } catch (err) {
      let msg = err.response?.data?.message || "Registration failed. Please try again.";

      // Improve error messages to be more specific and actionable
      if (msg.includes("Email already registered")) {
        msg = "This email is already registered. Please login or use a different email address.";
      } else if (msg.includes("An error occurred")) {
        msg = "Unable to connect to the server. Please check your internet connection and try again.";
      }

      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    console.log("Google Sign-In clicked");
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    }
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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Login Options
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.businessIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21H21V19H3V21ZM5 10V18H7V10H5ZM11 6V18H13V6H11ZM17 2V18H19V2H17Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className={styles.title}>Private Business Portal</h1>
          <p className={styles.subtitle}>
            {isLogin
              ? "Welcome back! Sign in to your account"
              : "Join our tourism network and grow your business"}
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

        {/* Forms Container */}
        <div className={styles.formContainer}>
          {isLogin ? (
            // Login Form
            <form className={styles.form} onSubmit={handleLoginSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={(e) => handleInputChange(e, "login")}
                  className={styles.input}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={(e) => handleInputChange(e, "login")}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.875 18.825A10.05 10.05 0 0 1 12 19C4.5 19 1 12 1 12A13.16 13.16 0 0 1 5.825 7.5M9.9 4.24A9.12 9.12 0 0 1 12 4C19.5 4 23 12 23 12A13.16 13.16 0 0 1 19.77 16.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 1L23 23"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.9 9.9A3 3 0 1 0 14.1 14.1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.forgotPassword}>
                <a href="#" className={styles.forgotLink}>
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <button
                type="button"
                className={styles.googleBtn}
                onClick={handleGoogleSignIn}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className={styles.switchForm}>
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={styles.switchLink}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // Signup Form
            <form className={styles.form} onSubmit={handleSignupSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={signupData.name}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={styles.input}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="signupEmail" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="signupEmail"
                  name="email"
                  value={signupData.email}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={styles.input}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="contactNo" className={styles.label}>
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  value={signupData.contactNo}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={styles.input}
                  placeholder="Enter your contact number"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="tourismService" className={styles.label}>
                  Business Category
                </label>
                <select
                  id="tourismService"
                  name="tourismService"
                  value={signupData.tourismService}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={styles.select}
                  required
                >
                  <option value="">Select your business Category</option>
                  {tourismServices.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="businessName" className={styles.label}>
                  Business Type
                </label>
                <select
                  id="businessName"
                  name="businessName"
                  value={signupData.businessName}
                  onChange={(e) => handleInputChange(e, "signup")}
                  className={styles.select}
                  required
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="signupPassword" className={styles.label}>
                  Password
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    placeholder="Password"
                    id="signupPassword"
                    name="password"
                    value={signupData.password}
                    onChange={(e) => handleInputChange(e, "signup")}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.875 18.825A10.05 10.05 0 0 1 12 19C4.5 19 1 12 1 12A13.16 13.16 0 0 1 5.825 7.5M9.9 4.24A9.12 9.12 0 0 1 12 4C19.5 4 23 12 23 12A13.16 13.16 0 0 1 19.77 16.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 1L23 23"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.9 9.9A3 3 0 1 0 14.1 14.1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={styles.input}
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={(e) => handleInputChange(e, "signup")}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.875 18.825A10.05 10.05 0 0 1 12 19C4.5 19 1 12 1 12A13.16 13.16 0 0 1 5.825 7.5M9.9 4.24A9.12 9.12 0 0 1 12 4C19.5 4 23 12 23 12A13.16 13.16 0 0 1 19.77 16.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 1L23 23"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.9 9.9A3 3 0 1 0 14.1 14.1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <button
                type="button"
                className={styles.googleBtn}
                onClick={handleGoogleSignIn}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </button>

              <div className={styles.switchForm}>
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={styles.switchLink}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Business;
