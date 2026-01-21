import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
// Feature images
import SikkimImage from "../../assets/SikkimImage.jpg";
import HomestayImage from "../../assets/Homestays.jpg";
import BikeImage from "../../assets/BikeRents.jpg";
import PlacesImage from "../../assets/Places.jpg";

// Video
import HeroVideo from "../../assets/HeroVideo.mp4";

// Carousel images (5 slides)
import Slide1 from "../../assets/Slide1.jpg";
import Slide2 from "../../assets/Slide2.jpg";
import Slide3 from "../../assets/Slide3.jpg";
import Slide4 from "../../assets/Slide4.jpg";
import Slide5 from "../../assets/Slide5.jpg";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
 
const Home = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  // Preload images
  useEffect(() => {
    const imageUrls = [Slide1, Slide2, Slide3, Slide4, Slide5];
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="Home">
      {/* Hero Section with Video */}
      <div className="top">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source src={HeroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls */}
        <div className="video-controls">
          <button
            className="mute-button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V16.02C15.5 15.29 16.5 13.77 16.5 12Z"
                  fill="currentColor"
                />
                <path
                  d="M19 12C19 15.53 16.39 18.45 13 18.93V16.87C15.33 16.43 17 14.42 17 12C17 9.58 15.33 7.57 13 7.13V5.07C16.39 5.55 19 8.47 19 12Z"
                  fill="currentColor"
                />
                <path
                  d="M12 4L9.91 6.09L12 8.18M4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.52C15.58 18.04 14.83 18.46 14 18.7V20.77C15.38 20.45 16.63 19.82 17.68 18.96L19.73 21L21 19.73L12 10.73M19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.62 14.91 21 13.5 21 12C21 7.72 18 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM16.5 12C16.5 10.23 15.5 8.71 14 7.97V10.18L16.45 12.63C16.5 12.43 16.5 12.21 16.5 12Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="currentColor" />
                <path
                  d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V16.02C15.5 15.29 16.5 13.77 16.5 12Z"
                  fill="currentColor"
                />
                <path
                  d="M14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Explore Now Button */}
        <div className="explore-button-container">
          <Link to="/places" className="explore-button">
            Explore Now
          </Link>
        </div>
      </div>

      <div className="unified-bg-section">
        <div className="carousel-section">
          <div className="carousel-heading">
            <h2>Discover Sikkim’s Beauty</h2>
            <p>
              Explore breathtaking landscapes, vibrant culture, and
              unforgettable moments.
            </p>
            <p>Note:- This is a Tour & Travel guide Website.</p>
          </div>

          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3000}
            transitionTime={2000}
            swipeable={true}
            emulateTouch={true}
            useKeyboardArrows={true}
            showArrows={true}
            stopOnHover={true}
            animationHandler="fade"
          >
            {[Slide1, Slide2, Slide3, Slide4, Slide5].map((img, i) => (
              <div className="carousel-slide-modern" key={i}>
                <img src={img} alt={`Slide ${i + 1}`} loading="eager" />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <img src={HomestayImage} alt="Homestays" />
            <h3>Comfortable Homestays</h3>
            <p>
              Book cozy stays with locals and experience true Sikkimese
              hospitality.
            </p>
          </div>

          <div className="feature-card">
            <img src={BikeImage} alt="Bike Rentals" />
            <h3>Bike Rentals</h3>
            <p>Rent bikes easily and explore the mountains at your own pace.</p>
          </div>

          <div className="feature-card">
            <img src={PlacesImage} alt="Places to Visit" />
            <h3>Must Visit Places</h3>
            <p>Get curated guides to top tourist spots in Sikkim.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
