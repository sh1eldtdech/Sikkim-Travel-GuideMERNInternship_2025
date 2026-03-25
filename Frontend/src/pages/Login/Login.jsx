import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const handleCardClick = (userType) => {
    switch (userType) {
      case "traveler":
        navigate("/traveler-login");
        break;
      case "government":
        navigate("/government-login");
        break;
      case "business":
        navigate("/business-login");
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      {/* Background with Sikkim-inspired gradient */}
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome to{" "}
            <span className={styles.highlight}>Sikkim Travel Guidebook</span>
          </h1>
          <p className={styles.subtitle}>Choose your account type</p>
        </div>

        {/* Cards Container */}
        <div className={styles.cardsContainer}>
          {/* Traveler Card */}
          <div
            className={`${styles.card} ${styles.travelerCard}`}
            onClick={() => handleCardClick("traveler")}
          >
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor" />
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Traveler</h3>
            <p className={styles.cardDescription}>
              Explore Sikkim's breathtaking landscapes and discover hidden gems
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.clickText}>Click to Continue</span>
            </div>
          </div>

          {/* Government Card */}
          <div
            className={`${styles.card} ${styles.governmentCard}`}
            onClick={() => handleCardClick("government")}
          >
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" fill="currentColor" />
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Government Agencies</h3>
            <p className={styles.cardDescription}>
              We provide reliable travel information to promote tourism and local growth
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.clickText}>Click to Continue</span>
            </div>
          </div>

          {/* Business Card */}
          <div
            className={`${styles.card} ${styles.businessCard}`}
            onClick={() => handleCardClick("business")}
          >
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21V19H3V21ZM5 10V18H7V10H5ZM11 6V18H13V6H11ZM17 2V18H19V2H17Z" fill="currentColor" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Private Business</h3>
            <p className={styles.cardDescription}>
              Showcase your services, connect with travelers, and grow your tourism business
            </p>
            <div className={styles.cardFooter}>
              <span className={styles.clickText}>Click to Continue</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>
            Experience the magic of Sikkim with our comprehensive travel guide
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
