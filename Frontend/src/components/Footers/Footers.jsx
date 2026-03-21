import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

import instagramIcon from '../../assets/icons/instagram.png';
import facebookIcon  from '../../assets/icons/facebook.png';
import twitterIcon   from '../../assets/icons/twitter.png';

const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });

const EXPLORE = [
  { label:'Home',             to:'/' },
  { label:'Destinations',     to:'/places' },
  { label:'Adventure',        to:'/adventure-zone' },
  { label:'Blogs & Articles', to:'/vlog' },
  { label:'Hotels & Stays',   to:'/hotels' },
  { label:'Disaster Alerts',  to:'/disaster-alerts' },
];

const DISTRICTS = [
  { label:'North Sikkim', to:'/north-sikkim' },
  { label:'East Sikkim',  to:'/east-sikkim' },
  { label:'West Sikkim',  to:'/west-sikkim' },
  { label:'South Sikkim', to:'/south-sikkim' },
];

const COMPANY = [
  { label:'About Us',    to:'/about' },
  { label:'Contact Us',  to:'/contact' },
  { label:'Admin Login', to:'/login' },
];

const SOCIALS = [
  { icon: instagramIcon, alt: 'Instagram',   href: 'https://www.instagram.com', label: 'Instagram', color: '#E1306C', bg: '#fce4ec' },
  { icon: facebookIcon,  alt: 'Facebook',    href: 'https://www.facebook.com',  label: 'Facebook',  color: '#1877F2', bg: '#e3f0ff' },
  { icon: twitterIcon,   alt: 'Twitter / X', href: 'https://www.twitter.com',   label: 'Twitter',   color: '#1DA1F2', bg: '#e1f5fe' },
];

export default function Footers() {
  const year     = new Date().getFullYear();
  const navigate = useNavigate();

  const goTo = (path) => { scrollTop(); navigate(path); };

  return (
    <footer className="ft">

      <div className="ft-accent-bar" />

      <div className="ft-body">
        <div className="ft-inner">

          {/* Brand */}
          <div className="ft-brand">
            <span className="ft-logo" onClick={() => goTo("/")} style={{ cursor:"pointer" }}>
              SH1ELD Tech
            </span>
            <p className="ft-tagline">
              Your complete guide to Sikkim — real-time alerts, curated destinations and everything you need for the perfect Himalayan journey.
            </p>
            <div className="ft-socials">
              {SOCIALS.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="ft-social"
                  style={{ '--s-color': s.color, '--s-bg': s.bg }}
                >
                  <img src={s.icon} alt={s.alt} className="ft-social-img" />
                  <span className="ft-social-label">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="ft-col">
            <h4 className="ft-col-title">Explore</h4>
            <ul className="ft-list">
              {EXPLORE.map((n, i) => (
                <li key={i}>
                  <span className="ft-link" onClick={() => goTo(n.to)}>
                    <span className="ft-link-arrow">→</span>{n.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Districts */}
          <div className="ft-col">
            <h4 className="ft-col-title">Districts</h4>
            <ul className="ft-list">
              {DISTRICTS.map((d, i) => (
                <li key={i}>
                  <span className="ft-link" onClick={() => goTo(d.to)}>
                    <span className="ft-link-arrow">→</span>{d.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="ft-col">
            <h4 className="ft-col-title">Company</h4>
            <ul className="ft-list">
              {COMPANY.map((c, i) => (
                <li key={i}>
                  <span className="ft-link" onClick={() => goTo(c.to)}>
                    <span className="ft-link-arrow">→</span>{c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="ft-bottom">
        <div className="ft-bottom-inner">
          <span>© {year} SH1ELD Tech · Sikkim Travel Guide. All rights reserved.</span>
          <span className="ft-heart">Made with ❤️ for Sikkim</span>
        </div>
      </div>

    </footer>
  );
}