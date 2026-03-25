import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

import HomestayImage from "../../assets/Homestays.jpg";
import BikeImage     from "../../assets/BikeRents.jpg";
import PlacesImage   from "../../assets/Places.jpg";
import HeroVideo     from "../../assets/HeroVideo.mp4";
import CtaBg         from "../../assets/North Sikkim/Gurudongmar Lake.jpg";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import Slide1 from "../../assets/Slide1.jpg";
import Slide2 from "../../assets/Slide2.jpg";
import Slide3 from "../../assets/Slide3.jpg";
import Slide4 from "../../assets/Slide4.jpg";
import Slide5 from "../../assets/Slide5.jpg";

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

/* ─── District cards — each has its own image carousel ─── */
const DESTINATIONS = [
  {
    name:"North Sikkim", tag:"Alpine Wonder",
    desc:"Glacial lakes, snow-draped valleys and remote tribal villages at the roof of the world.",
    accent:"#0ea5e9", pill:"#e0f2fe", pillTxt:"#0369a1",
    link:"/north-sikkim", emoji:"🏔️",
    slides:[northImg1, northImg2, northImg3, northImg4, northImg5, northImg6],
  },
  {
    name:"East Sikkim", tag:"Cultural Heart",
    desc:"Gangtok's vibrant bazaars, Nathu La Pass and sweeping Himalayan panoramas at every turn.",
    accent:"#10b981", pill:"#d1fae5", pillTxt:"#065f46",
    link:"/east-sikkim", emoji:"🌄",
    slides:[eastImg1, eastImg2, eastImg3, eastImg4, eastImg5, eastImg6],
  },
  {
    name:"West Sikkim", tag:"Monastery Trail",
    desc:"Ancient monasteries on misty ridgelines — Pelling's Kangchenjunga view is simply unmissable.",
    accent:"#8b5cf6", pill:"#ede9fe", pillTxt:"#5b21b6",
    link:"/west-sikkim", emoji:"🌿",
    slides:[westImg1, westImg2, westImg3, westImg4, westImg5, westImg6],
  },
  {
    name:"South Sikkim", tag:"Lush Escape",
    desc:"Terraced cardamom gardens, tropical forests and the serene Ravangla Buddha Park await.",
    accent:"#f97316", pill:"#ffedd5", pillTxt:"#9a3412",
    link:"/south-sikkim", emoji:"🌸",
    slides:[southImg1, southImg2, southImg3, southImg4, southImg5, southImg6],
  },
];

const EXPERIENCES = [
  { img:HomestayImage, title:"Homestays",      sub:"Live Like a Local",  desc:"Wake up to mountain views and share meals cooked over firewood with Sikkimese families.",   tag:"Accommodations", link:"/hotels" },
  { img:BikeImage,     title:"Bike Rentals",   sub:"Ride the Himalayas", desc:"Conquer high-altitude passes on your own schedule — the open road through clouds awaits.",   tag:"Adventure",      link:"/adventure-zone" },
  { img:PlacesImage,   title:"Curated Places", sub:"Expert Guides",      desc:"From hidden monasteries to glacial lakes — guides that take you beyond the tourist trail.",   tag:"Discovery",      link:"/places" },
];

const WHY = [
  { icon:"🛡️", title:"Safety First",       desc:"Real-time disaster alerts, road conditions and emergency contacts always at your fingertips." },
  { icon:"🗺️", title:"Local Expertise",    desc:"Built by people who live and breathe Sikkim — not a generic travel aggregator." },
  { icon:"📱", title:"Always Updated",     desc:"Live weather and permit requirements refreshed around the clock." },
  { icon:"🌱", title:"Responsible Travel", desc:"We promote eco-conscious tourism that preserves Sikkim's fragile ecosystem." },
  { icon:"🤝", title:"Community Driven",   desc:"Every listing supports local homestay owners, guides and small businesses." },
  { icon:"⚡", title:"Instant Access",     desc:"No sign-up friction — find what you need in seconds, plan in minutes." },
];

const TICKER = ["Gangtok","Lachen","Yumthang","Nathu La","Pelling","Ravangla","Yuksom","Namchi","Rumtek","Tsomgo Lake","Gurudongmar","Zuluk"];

/* ── Mini carousel inside each district card ── */
function DistrictCarousel({ slides, accent }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  const next = useCallback(() => setIdx(i => (i + 1) % slides.length), [slides.length]);

  useEffect(() => {
    timer.current = setInterval(next, 3000);
    return () => clearInterval(timer.current);
  }, [next]);

  return (
    <div className="dc-wrap">
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className={`dc-img ${i === idx ? "dc-active" : ""}`}
          loading="lazy" width="400" height="300" decoding="async"
        />
      ))}
      <div className="dc-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dc-dot ${i === idx ? "dc-dot-on" : ""}`}
            style={i === idx ? { background: accent } : {}}
            onClick={() => { setIdx(i); clearInterval(timer.current); timer.current = setInterval(next, 3000); }}
            aria-label={`Slide ${i+1}`}
          />
        ))}
      </div>
      <div className="dc-overlay" />
    </div>
  );
}

/* Helper — navigate to a route and immediately scroll to top */
function useNavTop() {
  const navigate = useNavigate();
  return (path) => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    navigate(path);
  };
}

export default function Home() {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [vis, setVis] = useState(new Set());
  const go = useNavTop();

  // Scroll to top when Home itself mounts
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, []);

  useEffect(() => {
    // Preload first image of each region for fast carousel start
    [northImg1, eastImg1, westImg1, southImg1].forEach(u => { const i=new Image(); i.src=u; });
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVis(p => new Set([...p, e.target.dataset.s]));
      }),
      { threshold: 0.07 }
    );
    document.querySelectorAll("[data-s]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const v = id => vis.has(id);

  return (
    <div className="hm">

      {/* ══════ HERO — video only, your text shows in video ══════ */}
      <div className="hm-hero">
        {/* Main video */}
        <video ref={videoRef} autoPlay loop muted playsInline className="hm-video">
          <source src={HeroVideo} type="video/mp4" />
        </video>
        <div className="hm-hero-shade" />

        {/* Single centred button, no other text */}
        <div className="hm-hero-cta">
          <button className="hm-cta-btn" onClick={() => go("/places")}>
            Explore Now <span className="hm-arrow">→</span>
          </button>
        </div>

        <button className="hm-mute" onClick={toggleMute} aria-label={isMuted?"Unmute":"Mute"}>
          {isMuted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.73 2.5-2.25 2.5-4.02zM19 12c0 3.53-2.61 6.45-6 6.93v-2.06c2.33-.44 4-2.45 4-4.87 0-2.42-1.67-4.43-4-4.87V5.07c3.39.48 6 3.4 6 6.93zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      </div>

      {/* ══════ DISCOVER — white ══════ */}
      <section className="hm-sec hm-white" data-s="discover">
        <div className={`hm-sec-text hm-center ${v("discover") ? "hm-up" : ""}`}>
          <span className="hm-label">✦ Explore Sikkim</span>
          <h2 className="hm-h2">Discover Sikkim's <em>Timeless Beauty</em></h2>
          <p className="hm-body">Breathtaking landscapes, vibrant monasteries and unforgettable moments Sikkim is unlike anywhere else on earth.</p>
          <p className="hm-note">📌 Tour &amp; Travel Guide Website</p>
        </div>

        <div className={`hm-slider-wrap ${v("discover") ? "hm-up hm-d2" : ""}`}>
          <Carousel
            autoPlay infiniteLoop showThumbs={false} showStatus={false}
            interval={3200} transitionTime={800} swipeable emulateTouch
            useKeyboardArrows showArrows stopOnHover animationHandler="fade"
          >
            {[Slide1,Slide2,Slide3,Slide4,Slide5].map((img,i) => (
              <div className="hm-slide" key={i}>
                <img src={img} alt={`Slide ${i+1}`} loading="lazy" width="800" height="400" decoding="async" />
                <div className="hm-slide-shade" />
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* ══════ DISTRICTS — white, cards with image carousels ══════ */}
      <section className="hm-sec hm-white hm-dist-sec" data-s="dist">
        <div className={`hm-sec-text hm-center ${v("dist") ? "hm-up" : ""}`}>
          <span className="hm-label">✦ Four Regions</span>
          <h2 className="hm-h2">Explore by <em>District</em></h2>
          <p className="hm-body">Each corner of Sikkim holds its own story alpine peaks, cultural hubs, monastery trails and lush valleys.</p>
        </div>

        <div className="hm-dist-grid">
          {DESTINATIONS.map((d, i) => (
            <div
              key={i}
              onClick={() => go(d.link)}
              className={`hm-dist-card ${v("dist") ? "hm-in" : ""}`}
              style={{ "--acc": d.accent, animationDelay: `${i * 0.12}s`, cursor:"pointer" }}
            >
              {/* Image carousel at top of card */}
              <DistrictCarousel slides={d.slides} accent={d.accent} />

              {/* Card content */}
              <div className="hm-dist-body">
                <div className="hm-dist-top">
                  <span className="hm-dist-pill" style={{ background: d.pill, color: d.pillTxt }}>
                    {d.emoji} {d.tag}
                  </span>
                </div>
                <h3 className="hm-dist-name">{d.name}</h3>
                <p className="hm-dist-desc">{d.desc}</p>
                <span className="hm-dist-link" style={{ color: d.accent }}>
                  Explore district <span className="hm-arrow">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ MARQUEE ══════ */}
      <div className="hm-marquee">
        <div className="hm-marquee-track">
          {[...TICKER,...TICKER,...TICKER,...TICKER].map((p,i) => (
            <span key={i} className="hm-mitem">{p}<span className="hm-mdot">✦</span></span>
          ))}
        </div>
      </div>

      {/* ══════ EXPERIENCES — light grey ══════ */}
      <section className="hm-sec hm-grey" data-s="exp">
        <div className={`hm-sec-text hm-center ${v("exp") ? "hm-up" : ""}`}>
          <span className="hm-label">✦ What We Offer</span>
          <h2 className="hm-h2">Curated <em>Experiences</em></h2>
          <p className="hm-body">Everything you need for the perfect Sikkim journey stays, rides and expert-curated guides, all in one place.</p>
        </div>

        <div className="hm-exp-grid">
          {EXPERIENCES.map((e, i) => (
            <div
              key={i}
              onClick={() => go(e.link)}
              className={`hm-exp-card ${v("exp") ? "hm-in" : ""}`}
              style={{ animationDelay: `${i * 0.15}s`, cursor:"pointer" }}
            >
              <div className="hm-exp-img">
                <img src={e.img} alt={e.title} loading="lazy" width="400" height="300" decoding="async" />
                <span className="hm-exp-tag">{e.tag}</span>
              </div>
              <div className="hm-exp-body">
                <div className="hm-exp-sub">{e.sub}</div>
                <h3 className="hm-exp-title">{e.title}</h3>
                <p className="hm-exp-desc">{e.desc}</p>
                <span className="hm-exp-link">Learn more <span className="hm-arrow">→</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ WHY — white ══════ */}
      <section className="hm-sec hm-white hm-why-sec" data-s="why">
        <div className="hm-why-left">
          <span className="hm-label">✦ Why SH1ELD Tech</span>
          <h2 className="hm-h2">Your Smarter<br /><em>Sikkim Companion</em></h2>
          <p className="hm-body">We go beyond listings SH1ELD Tech is the complete ecosystem for safe, informed and meaningful travel across Sikkim.</p>
          <button className="hm-solid-btn" onClick={() => go("/about")}>Learn About Us →</button>
        </div>
        <div className="hm-why-grid">
          {WHY.map((w, i) => (
            <div
              key={i}
              className={`hm-why-card ${v("why") ? "hm-in" : ""}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="hm-why-ico">{w.icon}</span>
              <h4 className="hm-why-title">{w.title}</h4>
              <p className="hm-why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ CTA — image background ══════ */}
      <section className="hm-cta-sec" data-s="cta" style={{ backgroundImage: `url(${CtaBg})` }}>
        <div className="hm-cta-orbs">
          <div className="orb o1"/><div className="orb o2"/><div className="orb o3"/>
        </div>
        <div className={`hm-cta-inner ${v("cta") ? "hm-up" : ""}`}>
          <span className="hm-cta-badge">🌿 Plan Your Trip Today</span>
          <h2 className="hm-cta-h">Sikkim Is Calling.<br />Are You Ready?</h2>
          <p className="hm-cta-p">Hundreds of places, real-time alerts and curated trails — everything to explore the last Himalayan kingdom.</p>
          <div className="hm-cta-btns">
            <button className="hm-cta-primary" onClick={() => go("/places")}>Start Exploring →</button>
            <button className="hm-cta-ghost" onClick={() => go("/disaster-alerts")}>Check Alerts</button>
          </div>
        </div>
      </section>

    </div>
  );
}