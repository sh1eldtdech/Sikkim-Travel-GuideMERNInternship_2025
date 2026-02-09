// Places.jsx with crousal
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Places.css";

// North Sikkim images
import northImg1 from "../../assets/North Sikkim/Zero Point.jpg";
import northImg2 from "../../assets/North Sikkim/Gurudongmar Lake.jpg";
import northImg3 from "../../assets/North Sikkim/Lachen.jpg";
import northImg4 from "../../assets/North Sikkim/Lachung.jpg";
import northImg5 from "../../assets/North Sikkim/Yumthang Valley.jpg";
import northImg6 from "../../assets/North Sikkim/Thangu Valley.jpg";

// East Sikkim images
import eastImg1 from "../../assets/East Sikkim/Gangtok.jpg";
import eastImg2 from "../../assets/East Sikkim/Tsomgo Lake.jpg";
import eastImg3 from "../../assets/East Sikkim/Nathula Pass.jpg";
import eastImg4 from "../../assets/East Sikkim/Rumtek Monastery.jpg";
import eastImg5 from "../../assets/East Sikkim/Hanuman Tok.jpg";
import eastImg6 from "../../assets/East Sikkim/Baba Harbhajan Singh.jpg";

// West Sikkim images
import westImg1 from "../../assets/West Sikkim/Yuksom.webp";
import westImg2 from "../../assets/West Sikkim/Pelling.jpg";
import westImg3 from "../../assets/West Sikkim/Khecheopalri Lake.jpg";
import westImg4 from "../../assets/West Sikkim/Rabdentse Ruins.jpg";
import westImg5 from "../../assets/West Sikkim/RimbiWaterfall.jpg";
import westImg6 from "../../assets/West Sikkim/DarapVillage.jpg";

// South Sikkim images
import southImg1 from "../../assets/South Sikkim/Ravangla.webp";
import southImg2 from "../../assets/South Sikkim/Namchi.jpg";
import southImg3 from "../../assets/South Sikkim/TemiTeaGarden.jpg";
import southImg4 from "../../assets/South Sikkim/MaenamHill.jpg";
import southImg5 from "../../assets/South Sikkim/Jorethang.jpg";
import southImg6 from "../../assets/South Sikkim/TendongHill.jpg";

const northImages = [northImg1, northImg2, northImg3, northImg4, northImg5, northImg6];
const eastImages = [eastImg1, eastImg2, eastImg3, eastImg4, eastImg5, eastImg6];
const westImages = [westImg1, westImg2, westImg3, westImg4, westImg5, westImg6];
const southImages = [southImg1, southImg2, southImg3, southImg4, southImg5, southImg6];

const ImageCarousel = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`${alt} ${index + 1}`}
          className={`places-region-image places-carousel-image ${index === currentIndex ? "places-carousel-active" : ""
            }`}
        />
      ))}
      <div className="places-carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`places-carousel-dot ${index === currentIndex ? "places-carousel-dot-active" : ""
              }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </>
  );
};

const Places = () => {
  return (
    <div className="places-page">
      {/* Hero Section */}
      <section className="places-hero">
        <div className="places-hero-overlay"></div>
        <div className="places-hero-content">
          <h1 className="places-hero-title">
            Sikkim: Where the Earth Touches the Sky
          </h1>
          <p className="places-hero-subtitle">
            Experience the serene majesty of the Himalayas and ancient
            monasteries in their purest, most untouched form.
          </p>
        </div>
        <div className="places-hero-arrow">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="7 13 12 18 17 13"></polyline>
            <polyline points="7 6 12 11 17 6"></polyline>
          </svg>
        </div>
      </section>

      {/* Regional Discovery Section */}
      <section className="places-regions">
        <div className="places-regions-container">
          <div className="places-regions-header">
            <div className="places-regions-header-content">
              <span className="places-section-label">Discover the Terrain</span>
              <h2 className="places-section-title">Regional Discovery</h2>
            </div>
          </div>

          <div className="places-regions-grid">
            <Link to="/north-sikkim" className="places-region-card">
              <div className="places-region-image-wrapper">
                <div className="places-region-overlay"></div>
                <ImageCarousel images={northImages} alt="North Sikkim" />
              </div>
              <h3 className="places-region-title">North Sikkim</h3>
              <p className="places-region-subtitle">Alpine Wilderness</p>
              <p className="places-region-description">
                Gateway to snow-capped giants and high-altitude valleys like
                Yumthang.
              </p>
            </Link>

            <Link to="/east-sikkim" className="places-region-card">
              <div className="places-region-image-wrapper">
                <div className="places-region-overlay"></div>
                <ImageCarousel images={eastImages} alt="East Sikkim" />
              </div>
              <h3 className="places-region-title">East Sikkim</h3>
              <p className="places-region-subtitle">Silk Route Heritage</p>
              <p className="places-region-description">
                Home to the sacred Tsomgo Lake and the bustling capital of
                Gangtok.
              </p>
            </Link>

            <Link to="/west-sikkim" className="places-region-card">
              <div className="places-region-image-wrapper">
                <div className="places-region-overlay"></div>
                <ImageCarousel images={westImages} alt="West Sikkim" />
              </div>
              <h3 className="places-region-title">West Sikkim</h3>
              <p className="places-region-subtitle">Cultural Heart</p>
              <p className="places-region-description">
                The historical seat of the Chogyals and the serene town of
                Pelling.
              </p>
            </Link>

            <Link to="/south-sikkim" className="places-region-card">
              <div className="places-region-image-wrapper">
                <div className="places-region-overlay"></div>
                <ImageCarousel images={southImages} alt="South Sikkim" />
              </div>
              <h3 className="places-region-title">South Sikkim</h3>
              <p className="places-region-subtitle">Garden of Peace</p>
              <p className="places-region-description">
                Famed for its Temi Tea gardens and the majestic Buddha Park in
                Ravangla.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Stories Section */}
      <section className="places-stories">
        <div className="places-stories-container">
          <div className="places-stories-header">
            <span className="places-stories-label">Personal Chronicles</span>
            <h2 className="places-stories-title">Travel Stories</h2>
            <p className="places-stories-subtitle">
              Voices from the high ridges and misty valleys, captured in moments
              of profound stillness.
            </p>
          </div>

          <div className="places-stories-grid">
            <div className="places-story-card">
              <div className="places-story-image-wrapper">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0tDoTsCe5zcITgEK6ddpvbed-pN_CCxfua_ybpZuyCc_117fEw9mi5dr6-rCfLiR_BTEbUYBmxD07oSTLMGd39BBnbarD8tN3lBygGtAeLB5TlbPhy__wkyDgThYsvlsBwRa0SA0i1EMYnB0eOZvLsULQcYsSVwbQbOulLT5pw-k0wcr7_VlkW2oNI6wrxACpv0090OyhI_6MGUmWpYd4kP9Gc-6rKzOooVlHgE-Dbz9bJaT24ANsjwVWn58PpBy_XAgaN9SO"
                  alt="Quiet morning in North Sikkim"
                  className="places-story-image"
                />
                <div className="places-story-image-overlay"></div>
              </div>
              <div className="places-story-content">
                <h3 className="places-story-quote">
                  "The mist whispers through the pines, a language only the
                  heart understands."
                </h3>
                <div className="places-story-author">
                  <div className="places-story-divider"></div>
                  <span className="places-story-name">Elena Rossi</span>
                </div>
              </div>
            </div>

            <div className="places-story-card places-story-card-offset">
              <div className="places-story-image-wrapper">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoGhdo0U_oTPMv4ebiKvU5BtYbUHgm58RPgG8OLSrjOKsPzb2n6NaxDD5T9JKFbzD3892f1Um0T2JlSZLf8uQTds3c2GftAR4l8rUe56WAETROr4Wi4UR2PfA9e-Qlq5y-gUh8RXVvIFNwcblQASGEXVAi8OTytx3NP9IwX6low_QakaWxr4t_XUfaE4SaCas28BZvlm30a09L1CffwPKWFYtY7KODcCACmW6_o4W_asW2r1FBoMTRw5lFlws9iUazPlqslLdE"
                  alt="Buddhist Monastery"
                  className="places-story-image"
                />
                <div className="places-story-image-overlay"></div>
              </div>
              <div className="places-story-content">
                <h3 className="places-story-quote">
                  "Time dissolves where prayer flags dance. I found a silence I
                  never knew I lost."
                </h3>
                <div className="places-story-author">
                  <div className="places-story-divider"></div>
                  <span className="places-story-name">David Chen</span>
                </div>
              </div>
            </div>

            <div className="places-story-card">
              <div className="places-story-image-wrapper">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgGhZ4gd5z7gVcqxv9NfOy1JK3zeVfdqDQg6Lqp6TklJnkgDe52H0qK3xZUsrycE0yWyen54zGEz7S4iaCyrrVOe8a1O2mNLOPSEpTDtMytTAPWDPTZMFB-c4CnxutY2UWfLf9sJIyNpZjOsjmZrD2R1XWAiVoqeLnMILnXRFLlL6z7EYdzi6XXaPd1v8FriFSFfXr_53Lpxy8_nUmx9K4zaffDLwFH4qACAdZdd5uYmE8D4TTRQCj_MP-nctV1t8YYE9AsdmG"
                  alt="Temi Tea Garden"
                  className="places-story-image"
                />
                <div className="places-story-image-overlay"></div>
              </div>
              <div className="places-story-content">
                <h3 className="places-story-quote">
                  "Emerald slopes and morning dew; every cup of tea here tells a
                  thousand-year story."
                </h3>
                <div className="places-story-author">
                  <div className="places-story-divider"></div>
                  <span className="places-story-name">Aarav Mehta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Places;
