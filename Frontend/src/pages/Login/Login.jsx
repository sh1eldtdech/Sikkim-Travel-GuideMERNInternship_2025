import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Landmark, Briefcase } from "lucide-react";
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
        navigate("/owner-login");
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.fogOverlay}></div>
      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.highlight}>Sikkim</span> Travel Guide
          </h1>
          <p className={styles.subtitle}>
            Choose your account type to continue your journey
          </p>
        </div>

        {/* Cards Container */}
        <div className={styles.cardsContainer}>
          {/* Traveler Card */}
          <div
            className={`${styles.card} ${styles.travelerCard}`}
            onClick={() => handleCardClick("traveler")}
          >
            <div className={styles.cardIcon}>
              <Compass size={32} strokeWidth={1.5} />
            </div>
            <h3 className={styles.cardTitle}>Traveler</h3>
            <p className={styles.cardDescription}>
              Explore Sikkim's breathtaking landscapes and discover hidden gems
            </p>
            <div className={styles.cardAction}>
              <span>Enter Portal</span>
              <div className={styles.arrow}>→</div>
            </div>
          </div>

          {/* Government Card */}
          <div
            className={`${styles.card} ${styles.governmentCard}`}
            onClick={() => handleCardClick("government")}
          >
            <div className={styles.cardIcon}>
              <Landmark size={32} strokeWidth={1.5} />
            </div>
            <h3 className={styles.cardTitle}>Government</h3>
            <p className={styles.cardDescription}>
              Official access for government agencies and tourism departments
            </p>
            <div className={styles.cardAction}>
              <span>Enter Portal</span>
              <div className={styles.arrow}>→</div>
            </div>
          </div>

          {/* Business Card */}
          <div
            className={`${styles.card} ${styles.businessCard}`}
            onClick={() => handleCardClick("business")}
          >
            <div className={styles.cardIcon}>
              <Briefcase size={32} strokeWidth={1.5} />
            </div>
            <h3 className={styles.cardTitle}>Business</h3>
            <p className={styles.cardDescription}>
              Showcase your services and connect with travelers
            </p>
            <div className={styles.cardAction}>
              <span>Enter Portal</span>
              <div className={styles.arrow}>→</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>Experience the magic of the Himalayas</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
