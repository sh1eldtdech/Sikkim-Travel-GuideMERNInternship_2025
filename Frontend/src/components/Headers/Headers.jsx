import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Headers.css";

const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });

const Headers = () => {
  const [scrolled, setScrolled]             = useState(false);
  const [lastY, setLastY]                   = useState(0);
  const [destOpen, setDestOpen]             = useState(false);
  const [moreOpen, setMoreOpen]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [mobileDestOpen, setMobileDestOpen] = useState(false);

  const destTimer = useRef(null);
  const moreTimer = useRef(null);
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

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

  const destEnter = () => { clearTimeout(destTimer.current); setDestOpen(true); };
  const destLeave = () => { destTimer.current = setTimeout(() => setDestOpen(false), 130); };
  const moreEnter = () => { clearTimeout(moreTimer.current); setMoreOpen(true); };
  const moreLeave = () => { moreTimer.current = setTimeout(() => setMoreOpen(false), 130); };

  const closeMobile = () => { setMobileOpen(false); setMobileDestOpen(false); };

  const goTo = (path) => {
    scrollTop();
    navigate(path);
    closeMobile();
    setDestOpen(false);
    setMoreOpen(false);
  };

  const rootClass = ["sh-header", scrolled ? "sh-scrolled" : ""].filter(Boolean).join(" ");

  return (
    <>
      <header className={rootClass}>
        <div className="sh-bar">

          {/* Logo */}
          <span className="sh-logo" onClick={() => goTo("/")} style={{cursor:"pointer"}}>SH1ELD Tech</span>

          {/* Desktop Nav */}
          <nav className="sh-nav">
            <span className="sh-link" onClick={() => goTo("/")}>Home</span>

            {/* Destinations dropdown */}
            <div className="sh-dd" onMouseEnter={destEnter} onMouseLeave={destLeave}>
              <span className={`sh-link sh-trig ${destOpen ? "active" : ""}`} onClick={() => goTo("/places")}>
                Destinations
                <svg className={`sh-arr ${destOpen ? "flip" : ""}`} viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div className={`sh-panel ${destOpen ? "sh-panel-open" : ""}`}>
                <span className="sh-plink" onClick={() => goTo("/north-sikkim")}><span>🏔</span>North Sikkim</span>
                <span className="sh-plink" onClick={() => goTo("/east-sikkim")}><span>🌄</span>East Sikkim</span>
                <span className="sh-plink" onClick={() => goTo("/west-sikkim")}><span>🌿</span>West Sikkim</span>
                <span className="sh-plink" onClick={() => goTo("/south-sikkim")}><span>🌸</span>South Sikkim</span>
              </div>
            </div>

            <span className="sh-link" onClick={() => goTo("/adventure-zone")}>Adventure</span>
            <span className="sh-link sh-alert-link" onClick={() => goTo("/disaster-alerts")}>Disaster Alerts</span>
            <span className="sh-link" onClick={() => goTo("/vlog")}>Blogs &amp; Articles</span>
          </nav>

          {/* Desktop hamburger */}
          <div className="sh-dd sh-more-dd" onMouseEnter={moreEnter} onMouseLeave={moreLeave}>
            <button className={`sh-hbg ${moreOpen ? "sh-hbg-open" : ""}`} aria-label="More">
              <span/><span/><span/>
            </button>
            <div className={`sh-panel sh-panel-right ${moreOpen ? "sh-panel-open" : ""}`}>
              <span className="sh-plink" onClick={() => goTo("/about")}>About</span>
              <span className="sh-plink" onClick={() => goTo("/hotels")}>Hotels &amp; Accommodations</span>
              <span className="sh-plink" onClick={() => goTo("/contact")}>Contact Us</span>
              <span className="sh-plink" onClick={() => goTo("/login")}>Admin Login</span>
            </div>
          </div>

          {/* Mobile area */}
          <div className="sh-mobile-area">
            <div className="sh-mob-inline">
              <span className="sh-mob-inline-link" onClick={() => goTo("/")}>Home</span>
              <span className="sh-mob-inline-link" onClick={() => goTo("/places")}>Destinations</span>
              <span className="sh-mob-inline-link" onClick={() => goTo("/adventure-zone")}>Adventure</span>
            </div>
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

      {/* Mobile overlay + panel */}
      <div className={`sh-mob-overlay ${mobileOpen ? "open" : ""}`} onClick={closeMobile} />
      <div className={`sh-mob-panel ${mobileOpen ? "sh-mob-open" : ""} sh-mobile-area`}>
        <div className="sh-mob-panel-inner">

          <div>
            <button className={`sh-mlink sh-macc ${mobileDestOpen ? "open" : ""}`} onClick={() => setMobileDestOpen(v => !v)}>
              <span>Destinations</span>
              <svg className={`sh-arr ${mobileDestOpen ? "flip" : ""}`} viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={`sh-msub ${mobileDestOpen ? "sh-msub-open" : ""}`}>
              <span className="sh-msub-link" onClick={() => goTo("/north-sikkim")}>🏔 North Sikkim</span>
              <span className="sh-msub-link" onClick={() => goTo("/east-sikkim")}>🌄 East Sikkim</span>
              <span className="sh-msub-link" onClick={() => goTo("/west-sikkim")}>🌿 West Sikkim</span>
              <span className="sh-msub-link" onClick={() => goTo("/south-sikkim")}>🌸 South Sikkim</span>
            </div>
          </div>

          <div className="sh-mdiv"/>

          <span className="sh-mlink sh-malert" onClick={() => goTo("/disaster-alerts")}>⚠ Disaster Alerts</span>
          <span className="sh-mlink" onClick={() => goTo("/vlog")}>Blogs &amp; Articles</span>
          <span className="sh-mlink" onClick={() => goTo("/about")}>About</span>
          <span className="sh-mlink" onClick={() => goTo("/hotels")}>Hotels &amp; Accommodations</span>
          <span className="sh-mlink" onClick={() => goTo("/contact")}>Contact Us</span>
          <span className="sh-mlink sh-mlogin" onClick={() => goTo("/login")}>Admin Login</span>
        </div>
      </div>
    </>
  );
};

export default Headers;