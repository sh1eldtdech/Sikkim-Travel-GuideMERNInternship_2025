import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Headers.css";

const Headers = () => {
  const [scrolled, setScrolled] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  // Enhanced scroll detection with direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state
      setScrolled(currentScrollY > 50);
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleResizeDropdowns = () => {
    if (window.innerWidth > 960) {
      setTravelOpen(false);
      setMoreOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResizeDropdowns);
    return () => window.removeEventListener("resize", handleResizeDropdowns);
  }, []);

  const isMobile = window.innerWidth <= 960;

  // Combine classes for header
  const headerClasses = [
    "header",
    scrolled ? "scrolled" : "",
    scrollDirection === "down" && scrolled ? "scrolling-down" : "",
    scrollDirection === "up" ? "scrolling-up" : ""
  ].filter(Boolean).join(" ");

  return (
    <header className={headerClasses}>
      <div className="header-content">
        <Link to="/" className="logo">SH1ELD Tech</Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>

          <div
            className="dropdown travel-dropdown"
            onMouseEnter={() => !isMobile && setTravelOpen(true)}
            onMouseLeave={() => !isMobile && setTravelOpen(false)}
            onClick={() => isMobile && setTravelOpen(!travelOpen)}
          >
            <Link to="/places" className="nav-link">
            <span className="nav-link dropdown-trigger">
              Travel Destinations
            </span>
            </Link>

            {(travelOpen || !isMobile) && (
              <div className="dropdown-content">
                <Link to="/north-sikkim" className="nav-link" onClick={() => setTravelOpen(false)}>North Sikkim</Link>
                <Link to="/east-sikkim" className="nav-link" onClick={() => setTravelOpen(false)}>East Sikkim</Link>
                <Link to="/west-sikkim" className="nav-link" onClick={() => setTravelOpen(false)}>West Sikkim</Link>
                <Link to="/south-sikkim" className="nav-link" onClick={() => setTravelOpen(false)}>South Sikkim</Link>
              </div>
            )}
          </div>

          <Link to="/adventure-zone" className="nav-link">Adventure Zone</Link>
          <Link to="/vlog" className="nav-link">Blogs & Articles</Link>
        </nav>

        <div
          className="dropdown more-menu left-aligned"
          onMouseEnter={() => !isMobile && setMoreOpen(true)}
          onMouseLeave={() => !isMobile && setMoreOpen(false)}
          onClick={() => isMobile && setMoreOpen(!moreOpen)}
        >
          <div className="hamburger more-btn">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>

          {(moreOpen || !isMobile) && (
            <div className="dropdown-content">
              <Link to="/hotels" className="nav-link" onClick={() => setMoreOpen(false)}>Hotels & Accommodations</Link>
              <Link to="/disaster-alerts" className="nav-link" onClick={() => setMoreOpen(false)}>Disaster Alerts</Link>
              <Link to="/contact" className="nav-link" onClick={() => setMoreOpen(false)}>Contact Us</Link>
              <Link to="/login" className="nav-link" onClick={() => setMoreOpen(false)}>Admin Login</Link>
              <Link to="/permit" className="nav-link" onClick={() => setMoreOpen(false)}>Permit</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Headers;