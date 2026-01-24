import React from "react";
import "./AboutUs.css";

// Import custom icons
import cyberSecurityIcon from "../../assets/icons/cyber-security.png";
import webDevIcon from "../../assets/icons/web-development.png";
import itInfraIcon from "../../assets/icons/it-infrastructure.png";
import consultingIcon from "../../assets/icons/consulting.png";
import trainingIcon from "../../assets/icons/training.png";
import networkIcon from "../../assets/icons/network.png";

const AboutUs = () => {
  const services = [
    {
      icon: cyberSecurityIcon,
      title: "Cyber Security",
      description:
        "Comprehensive Vulnerability Assessment and Penetration Testing (VAPT) of digital assets to secure your infrastructure.",
    },
    {
      icon: webDevIcon,
      title: "Web Development",
      description:
        "Design & Development of modern, responsive websites tailored to your business needs.",
    },
    {
      icon: itInfraIcon,
      title: "IT Infrastructure",
      description:
        "Planning and executing successful IT Infrastructure projects for businesses and institutions.",
    },
    {
      icon: networkIcon,
      title: "Network Solutions",
      description:
        "Expert network design, implementation, and security solutions for organizations of all sizes.",
    },
    {
      icon: trainingIcon,
      title: "Training & Events",
      description:
        "Online and offline events, workshops, and training programs on Cyber Security and IT awareness.",
    },
    {
      icon: consultingIcon,
      title: "Consulting",
      description:
        "Strategic IT consulting for businesses, governments, and educational institutions.",
    },
  ];

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-content">
          <div className="about-badge">
            <span className="about-badge-dot"></span>
            <span className="about-badge-text">
              ISO 9001:2015 Certified
            </span>
          </div>

          <h1 className="about-hero-title">
            SH1ELD Tech
          </h1>
          <p className="about-hero-subtitle">
            InfoSec Solutions Private Limited
          </p>

          <p className="about-hero-description">
            A leading Information Technology training & service provider
            dedicated to promoting Cyber Security, IT, Web Development and Digital Awareness.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="about-section">
        <div className="about-section-content">
          <div className="about-grid">
            <div className="about-text-section">
              <div className="about-section-label">
                <div className="about-section-line"></div>
                <span className="about-section-label-text">
                  Who We Are
                </span>
              </div>

              <h2 className="about-section-title">
                Securing the Digital Future
              </h2>

              <p className="about-section-text">
                SH1ELD Tech InfoSec Solutions Private Limited is an{" "}
                <span className="about-section-text-highlight">
                  ISO 9001:2015 certified
                </span>{" "}
                company at the forefront of Information Technology training and
                services.
              </p>

              <p className="about-section-text-small">
                Our skilled and diverse team members are dedicated towards
                promoting and encouraging Cyber Security, IT, and Digital
                Awareness in an Effective and Efficient approach. We believe in
                empowering organizations with the knowledge and tools they need
                to navigate the digital landscape securely.
              </p>
            </div>

            <div className="about-stats-grid">
              {[
                { value: "200+", label: "Projects Completed" },
                { value: "150+", label: "Happy Clients" },
                { value: "35+", label: "Team Members" },
                { value: "7+", label: "Years Experience" },
              ].map((stat, index) => (
                <div key={index} className="about-stat-card">
                  <div className="about-stat-value">
                    {stat.value}
                  </div>
                  <div className="about-stat-label">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="about-services-section">
        <div className="about-section-content">
          <div className="about-services-header">
            <div className="about-services-label">
              <div className="about-section-line"></div>
              <span className="about-section-label-text">
                What We Do
              </span>
              <div className="about-section-line"></div>
            </div>
            <h2 className="about-section-title">
              Our Services
            </h2>
          </div>

          <div className="about-services-grid">
            {services.map((service, index) => (
              <div key={index} className="hover-3d">
                <div className="about-service-card">
                  <div className="about-service-icon">
                    <img 
                      src={service.icon} 
                      alt={service.title}
                      className="service-icon-img"
                    />
                  </div>
                  <h3 className="about-service-title">
                    {service.title}
                  </h3>
                  <p className="about-service-description">
                    {service.description}
                  </p>
                </div>
                {/* 8 empty divs needed for the 3D effect */}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-contact-section">
        <div className="about-contact-content">
          <div className="about-contact-card">
            <div className="about-contact-label">
              <span className="about-section-label-text">
                Get In Touch
              </span>
            </div>

            <h2 className="about-contact-title">
              Ready to Secure Your Digital Assets?
            </h2>

            <p className="about-contact-description">
              Connect with us to discuss how we can help protect and grow your
              digital infrastructure.
            </p>

            <div className="about-contact-buttons">
              <a
                href="mailto:shieldslabs@gmail.com"
                className="about-contact-btn about-contact-btn-primary"
              >
                <svg
                  className="about-contact-btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="about-contact-btn-text">shieldslabs@gmail.com</span>
              </a>

              <a
                href="https://sh1eldtech.com/#about"
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-btn about-contact-btn-secondary"
              >
                <svg
                  className="about-contact-btn-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                Visit Our Website
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Accent */}
      <div className="about-footer-accent"></div>
    </div>
  );
};

export default AboutUs;
