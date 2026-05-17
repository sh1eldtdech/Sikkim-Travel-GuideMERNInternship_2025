import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGovAuth } from "../../context/GovAuthContext";
import API from "../../utils/api";
import { toast } from "react-toastify";
import styles from "./Government.module.css";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

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
        toast.success("Welcome back! You're now logged in to your government dashboard.");
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
        toast.success("Account created successfully! Welcome to the government portal.");
        navigate("/government-dashboard");
      }
    } catch (error) {
      let msg = error.response?.data?.message || "An error occurred. Please try again.";

      // Improve error messages to be more specific and actionable
      if (msg.includes("Invalid email or password")) {
        msg = "Invalid email or password. Please check your credentials and try again.";
      } else if (msg.includes("Email already registered")) {
        msg = "This email is already registered. Please login or use a different email.";
      } else if (msg.includes("An error occurred")) {
        msg = "Unable to connect to the server. Please check your internet connection and try again.";
      }

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

  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement Google OAuth
      console.log("Google Sign In clicked");
    } catch (error) {
      console.error("Google Sign In error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.content}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {isLogin ? (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <div className={styles.inputWrapper}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${styles.input} ${styles.hasIcon} ${errors.email ? styles.error : ""}`}
                      placeholder="Email"
                    />
                  </div>
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.passwordContainer}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`${styles.input} ${styles.hasIcon} ${styles.passwordInput} ${errors.password ? styles.error : ""}`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>
              </>
            )}

            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>

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
