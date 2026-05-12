import React, { useEffect, useRef } from 'react';
import styles from './SikkimRegion.module.css';
import VideoHero from '../../components/VideoHero';

/* RegionPage — Reusable layout for all 4 Sikkim region pages.*/
const RegionPage = ({
  regionName,
  heroCaption,
  heroVideo,
  heroPoster,
  overviewTitle,
  overviewText,
  quickInfo = [],
  destinations = [],
}) => {
  const cardRefs = useRef([]);

  /* Intersection Observer for card fade-in */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Format index as zero-padded number (01, 02, …) */
  const pad = (n) => String(n).padStart(2, '0');

  /* Combine both highlight arrays into one flat pill list (max 8) */
  const getHighlights = (dest) => {
    const combined = [...(dest.highlights1 || []), ...(dest.highlights2 || [])];
    return combined.slice(0, 8);
  };

  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.heroSection}>
        <div className={styles.videoContainer}>
          <VideoHero className={styles.heroVideo} src={heroVideo} poster={heroPoster} />
          <div className={styles.videoOverlay} />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{regionName}</h1>
          <p className={styles.heroCaption}>{heroCaption}</p>
          <div className={styles.scrollIndicator}>
            <span>Explore</span>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className={styles.overviewSection}>
        <h2 className={styles.overviewTitle}>{overviewTitle}</h2>
        <div className={styles.titleUnderline} />
        <p className={styles.overviewText}>{overviewText}</p>
      </section>

      {/* Quick Info Bar */}
      {quickInfo.length > 0 && (
        <div className={styles.quickInfoBar}>
          {quickInfo.map((item, i) => (
            <div key={i} className={styles.quickInfoItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Destinations */}
      <section className={styles.destinationsSection}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Places to Visit</p>
          <h2 className={styles.sectionTitle}>Top Destinations</h2>
        </div>

        {destinations.map((dest, idx) => (
          <article
            key={dest.id}
            className={styles.destinationCard}
            ref={(el) => (cardRefs.current[idx] = el)}
            style={{ transitionDelay: `${(idx % 3) * 60}ms` }}
          >
            {/* Images */}
            <div className={styles.cardImages}>
              <div className={styles.imageWrapper}>
                <img
                  src={dest.image1}
                  alt={`${dest.name} — view 1`}
                  className={styles.destinationImage}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="400"
                />
              </div>
              <div className={styles.imageWrapper}>
                <img
                  src={dest.image2}
                  alt={`${dest.name} — view 2`}
                  className={styles.destinationImage}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="400"
                />
              </div>
            </div>

            {/* Content */}
            <div className={styles.cardContent}>
              <div className={styles.cardNumber}>{pad(idx + 1)}</div>
              <h3 className={styles.destinationTitle}>{dest.name}</h3>
              <p className={styles.destinationDescription}>{dest.description}</p>
              <div className={styles.highlightsPills}>
                {getHighlights(dest).map((hl, i) => (
                  <span key={i} className={styles.pill}>{hl}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default RegionPage;
