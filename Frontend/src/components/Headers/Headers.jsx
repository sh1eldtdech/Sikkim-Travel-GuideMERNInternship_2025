import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Headers.css";

const Headers = () => {
  const [scrolled, setScrolled]             = useState(false);
  const [scrollDir, setScrollDir]           = useState("up");
  const [lastY, setLastY]                   = useState(0);
  const [destOpen, setDestOpen]             = useState(false);
  const [moreOpen, setMoreOpen]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileDestOpen, setMobileDestOpen] = useState(false);

  const destTimer = useRef(null);
  const moreTimer = useRef(null);
  const navigate  = useNavigate();

  /* ── Scroll ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setScrollDir(y > lastY && y > 100 ? "down" : "up");
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  /* ── Close mobile panel on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".sh-mobile-area")) {
        setMobileOpen(false);
        setMobileDestOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Hover helpers ── */
  const destEnter = () => { clearTimeout(destTimer.current); setDestOpen(true); };
  const destLeave = () => { destTimer.current = setTimeout(() => setDestOpen(false), 130); };
  const moreEnter = () => { clearTimeout(moreTimer.current); setMoreOpen(true); };
  const moreLeave = () => { moreTimer.current = setTimeout(() => setMoreOpen(false), 130); };

  const closeMobile = () => { setMobileOpen(false); setMobileDestOpen(false); };

  /* Navigate to /places when clicking "Destinations" label directly */
  const handleDestClick = () => {
    navigate("/places");
    setDestOpen(false);
  };

  const rootClass = [
    "sh-header",
    scrolled ? "sh-scrolled" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <header className={rootClass}>
        <div className="sh-bar">

          {/* ── Logo ── */}
          <Link to="/" className="sh-logo">SH1ELD Tech</Link>

          {/* ── Desktop Nav (hidden on mobile) ── */}
          <nav className="sh-nav">
            <Link to="/" className="sh-link">Home</Link>

            {/* Destinations hover dropdown */}
            <div className="sh-dd" onMouseEnter={destEnter} onMouseLeave={destLeave}>
              <span
                className={`sh-link sh-trig ${destOpen ? "active" : ""}`}
                onClick={handleDestClick}
              >
                Destinations
                <svg className={`sh-arr ${destOpen ? "flip" : ""}`} viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className={`sh-panel ${destOpen ? "sh-panel-open" : ""}`}>
                <Link to="/north-sikkim" className="sh-plink" onClick={() => setDestOpen(false)}><span>🏔</span>North Sikkim</Link>
                <Link to="/east-sikkim"  className="sh-plink" onClick={() => setDestOpen(false)}><span>🌄</span>East Sikkim</Link>
                <Link to="/west-sikkim"  className="sh-plink" onClick={() => setDestOpen(false)}><span>🌿</span>West Sikkim</Link>
                <Link to="/south-sikkim" className="sh-plink" onClick={() => setDestOpen(false)}><span>🌸</span>South Sikkim</Link>
              </div>
            </div>

            <Link to="/adventure-zone"  className="sh-link">Adventure</Link>
            <Link to="/disaster-alerts" className="sh-link sh-alert-link">
              Disaster Alerts
            </Link>
            <Link to="/vlog" className="sh-link">Blogs &amp; Articles</Link>
          </nav>

          {/* ── Desktop Hamburger more-menu ── */}
          <div className="sh-dd sh-more-dd" onMouseEnter={moreEnter} onMouseLeave={moreLeave}>
            <button className={`sh-hbg ${moreOpen ? "sh-hbg-open" : ""}`} aria-label="More">
              <span/><span/><span/>
            </button>
            <div className={`sh-panel sh-panel-right ${moreOpen ? "sh-panel-open" : ""}`}>
              <Link to="/about"   className="sh-plink" onClick={() => setMoreOpen(false)}>About</Link>
              <Link to="/hotels"  className="sh-plink" onClick={() => setMoreOpen(false)}>Hotels &amp; Accommodations</Link>
              <Link to="/contact" className="sh-plink" onClick={() => setMoreOpen(false)}>Contact Us</Link>
              <Link to="/login"   className="sh-plink" onClick={() => setMoreOpen(false)}>Admin Login</Link>
            </div>
          </div>

          {/* ── Mobile: 3 visible links + hamburger ── */}
          <div className="sh-mobile-area">

            {/* 3 always-visible mobile nav links */}
            <div className="sh-mob-inline">
              <Link to="/" className="sh-mob-inline-link" onClick={closeMobile}>Home</Link>
              <Link to="/places" className="sh-mob-inline-link" onClick={closeMobile}>Destinations</Link>
              <Link to="/adventure-zone" className="sh-mob-inline-link" onClick={closeMobile}>Adventure</Link>
            </div>

            {/* Mobile hamburger → opens full panel */}
            <button
              className={`sh-hbg sh-mob-ham ${mobileOpen ? "sh-hbg-open" : ""}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="More menu"
            >
              <span/><span/><span/>
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile slide-down panel — rendered OUTSIDE header so it's not clipped ── */}
      <div className={`sh-mob-overlay ${mobileOpen ? "open" : ""}`} onClick={closeMobile} />
      <div className={`sh-mob-panel ${mobileOpen ? "sh-mob-open" : ""} sh-mobile-area`}>
        <div className="sh-mob-panel-inner">

          {/* Destinations accordion */}
          <div>
            <button
              className={`sh-mlink sh-macc ${mobileDestOpen ? "open" : ""}`}
              onClick={() => setMobileDestOpen(v => !v)}
            >
              <span>Destinations</span>
              <svg className={`sh-arr ${mobileDestOpen ? "flip" : ""}`} viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={`sh-msub ${mobileDestOpen ? "sh-msub-open" : ""}`}>
              <Link to="/north-sikkim" className="sh-msub-link" onClick={closeMobile}>🏔 North Sikkim</Link>
              <Link to="/east-sikkim"  className="sh-msub-link" onClick={closeMobile}>🌄 East Sikkim</Link>
              <Link to="/west-sikkim"  className="sh-msub-link" onClick={closeMobile}>🌿 West Sikkim</Link>
              <Link to="/south-sikkim" className="sh-msub-link" onClick={closeMobile}>🌸 South Sikkim</Link>
            </div>
          </div>

          <div className="sh-mdiv"/>

          <Link to="/disaster-alerts" className="sh-mlink sh-malert"  onClick={closeMobile}>⚠ Disaster Alerts</Link>
          <Link to="/vlog"            className="sh-mlink"            onClick={closeMobile}>Blogs &amp; Articles</Link>
          <Link to="/about"           className="sh-mlink"            onClick={closeMobile}>About</Link>
          <Link to="/hotels"          className="sh-mlink"            onClick={closeMobile}>Hotels &amp; Accommodations</Link>
          <Link to="/contact"         className="sh-mlink"            onClick={closeMobile}>Contact Us</Link>
          <Link to="/login"           className="sh-mlink sh-mlogin"  onClick={closeMobile}>Admin Login</Link>
        </div>
      </div>
    </>
  );
};

export default Headers;