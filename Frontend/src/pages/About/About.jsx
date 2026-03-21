import React, { useEffect, useState } from "react";
import "./About.css";

// Company service icons
import cyberSecurityIcon from "../../assets/icons/cyber-security.png";
import webDevIcon        from "../../assets/icons/web-development.png";
import itInfraIcon       from "../../assets/icons/it-infrastructure.png";
import consultingIcon    from "../../assets/icons/consulting.png";
import trainingIcon      from "../../assets/icons/training.png";
import networkIcon       from "../../assets/icons/network.png";

// Travel images
import TravelGuideImage  from "../../assets/travel-guide.jpeg";
import DisasterInfoImage from "../../assets/disaster-info.jpeg";
import BorderInfoImage   from "../../assets/boder-info.jpg";
import NorthSikkimImage  from "../../assets/north-sikkim.jpeg";
import SikkimHeroImage   from "../../assets/sikkim-hero.jpg";
import CtaBg             from "../../assets/North Sikkim/Gurudongmar Lake.jpg";

/* ── Data ── */
const STATS = [
  { value:"100+", label:"Projects Completed" },
  { value:"150+", label:"Happy Clients" },
  { value:"25+",  label:"Team Members" },
  { value:"7+",   label:"Years Experience" },
];

const SERVICES = [
  { icon:cyberSecurityIcon, title:"Cyber Security",    desc:"Comprehensive VAPT of digital assets to secure your infrastructure from threats." },
  { icon:webDevIcon,        title:"Web Development",   desc:"Design & development of modern, responsive websites tailored to your needs." },
  { icon:itInfraIcon,       title:"IT Infrastructure", desc:"Planning and executing successful IT infrastructure projects for businesses." },
  { icon:networkIcon,       title:"Network Solutions", desc:"Expert network design, implementation and security for all organization sizes." },
  { icon:trainingIcon,      title:"Training & Events", desc:"Workshops and programs on Cyber Security, IT awareness and digital skills." },
  { icon:consultingIcon,    title:"Consulting",        desc:"Strategic IT consulting for businesses, governments and educational institutions." },
];

const TRAVEL_SECTIONS = [
  {
    img: TravelGuideImage,
    title: "Travel Guide",
    intro: "Embark on an unforgettable journey through Sikkim's breathtaking landscapes and rich cultural heritage.",
    reverse: false,
    items: [
      { icon:"🗓️", title:"Best Time to Visit",      desc:"March–May and October–December offer the most pleasant weather. Spring brings blooming rhododendrons; autumn gives clear mountain views." },
      { icon:"🚌", title:"Local Transportation",     desc:"Shared jeeps and taxis are the primary modes of transport. Pre-book vehicles for long distances. Buses connect major towns." },
      { icon:"🏨", title:"Accommodation Options",    desc:"From luxury resorts to budget homestays — Sikkim offers diverse lodging. Book in advance during peak seasons." },
      { icon:"🍜", title:"Local Cuisine Guide",      desc:"Try momos, thukpa, and gundruk. Don't miss the local tea and organic produce from Sikkim's farms." },
    ],
  },
  {
    img: DisasterInfoImage,
    title: "Disaster Information",
    intro: "Stay safe and informed during your Sikkim adventure with our comprehensive emergency guide.",
    reverse: true,
    items: [
      { icon:"📞", title:"Emergency Contacts",    desc:"Police: 100 · Ambulance: 102 · Fire: 101 · Tourist Helpline: 1363" },
      { icon:"⚠️", title:"Landslide Alerts",      desc:"Monitor weather forecasts and local news. Avoid travel during heavy rainfall. Stay updated through official channels." },
      { icon:"🌡️", title:"Weather Warnings",      desc:"Check daily weather updates. Be prepared for sudden weather changes, especially in high-altitude areas." },
      { icon:"🚪", title:"Evacuation Procedures", desc:"Follow local authorities' instructions. Keep emergency supplies ready. Know the nearest safe locations and evacuation routes." },
    ],
  },
  {
    img: BorderInfoImage,
    title: "Border Guidelines",
    intro: "Essential information for smooth entry into Sikkim.",
    reverse: false,
    items: [
      { icon:"📄", title:"Entry Permits",              desc:"Inner Line Permit (ILP) required for all visitors. Apply online or at entry checkpoints. Valid for 7–30 days." },
      { icon:"📍", title:"Border Checkpoints",         desc:"Major entry points at Rangpo, Melli, and Jorethang. Keep documents ready. Foreign nationals need additional permits." },
      { icon:"🔒", title:"Restricted Areas",           desc:"Special permits needed for border areas. Photography restrictions in sensitive zones. Follow local guidelines strictly." },
      { icon:"🪪", title:"Documentation Requirements", desc:"Valid ID proof, passport photos, and travel itinerary required. Foreign nationals need passport and visa copies." },
    ],
  },
  {
    img: NorthSikkimImage,
    title: "North Sikkim Permit Guidelines",
    intro: "Navigate the permit process for North Sikkim's pristine landscapes.",
    reverse: true,
    items: [
      { icon:"📝", title:"Permit Application", desc:"Apply through registered travel agents or online portal. Processing time: 1–2 working days. Group permits available." },
      { icon:"🪪", title:"Required Documents", desc:"Valid ID proof, passport photos, hotel bookings, and travel itinerary. Foreign nationals need additional documentation." },
      { icon:"⏱️", title:"Permit Validity",    desc:"Valid for specific dates only. Maximum stay: 7 days. Non-extendable. Must be carried at all times." },
      { icon:"🚫", title:"Restricted Areas",   desc:"Special permits needed for Gurudongmar Lake and Yumthang Valley. Photography restrictions in certain areas." },
    ],
  },
];

/* ── Animated counter ── */
function Counter({ target }) {
  const [count, setCount] = useState(0);
  const num = parseInt(target);
  const suffix = target.replace(/[0-9]/g, "");

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 35);
    return () => clearInterval(timer);
  }, [num]);

  return <>{count}{suffix}</>;
}

export default function About() {
  const [statVisible, setStatVisible] = useState(false);

  useEffect(() => {
    const el = document.querySelector(".ab-stats");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatVisible(true); }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="ab">

      {/* ══ HERO ══ */}
      <section
        className="ab-hero"
        style={{ backgroundImage:`linear-gradient(rgba(13,31,20,0.55),rgba(0,0,0,0.6)),url(${SikkimHeroImage})` }}
      >
        <div className="ab-hero-inner">
          <span className="ab-badge">🏔 Sikkim Travel Guide</span>
          <h1 className="ab-hero-title">Discover Sikkim</h1>
          <p className="ab-hero-sub">Your Gateway to the Himalayan Paradise — curated guides, safety info and everything in between.</p>
        </div>
        <div className="ab-hero-scroll">
          <span>Scroll to explore</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* ══ COMPANY BAND ══ */}
      <section className="ab-company-band">
        <div className="ab-company-inner">
          <div className="ab-company-left">
            <span className="ab-eyebrow">✦ About the Team</span>
            <h2 className="ab-company-title">SH1ELD Tech <em>InfoSec Solutions</em></h2>
            <p className="ab-company-desc">
              An <strong>ISO 9001:2015 certified</strong> Information Technology training &amp; service provider dedicated to promoting Cyber Security, IT, Web Development and Digital Awareness across India.
            </p>
            <p className="ab-company-desc">
              Our skilled team empowers organizations with the knowledge and tools to navigate the digital landscape securely — from VAPT and infrastructure to training events and strategic consulting.
            </p>
            <div className="ab-company-btns">
              <a href="mailto:shieldslabs@gmail.com" className="ab-btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                shieldslabs@gmail.com
              </a>
              <a href="https://sh1eldtech.com" target="_blank" rel="noopener noreferrer" className="ab-btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                Visit Website ↗
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="ab-stats">
            {STATS.map((s, i) => (
              <div key={i} className="ab-stat">
                <div className="ab-stat-val">{statVisible ? <Counter target={s.value} /> : "0"}</div>
                <div className="ab-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="ab-services">
        <div className="ab-services-inner">
          <div className="ab-sec-hdr">
            <span className="ab-eyebrow">✦ What We Do</span>
            <h2 className="ab-sec-title">Our Services</h2>
            <p className="ab-sec-sub">From cyber security to web development — we build and protect your digital presence.</p>
          </div>
          <div className="ab-services-grid">
            {SERVICES.map((s, i) => (
              <div key={i} className="ab-service-card">
                <div className="ab-service-icon">
                  <img src={s.icon} alt={s.title} />
                </div>
                <h3 className="ab-service-title">{s.title}</h3>
                <p className="ab-service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRAVEL GUIDE SECTIONS ══ */}
      <div className="ab-travel">
        <div className="ab-travel-intro">
          <span className="ab-eyebrow">✦ Traveller's Companion</span>
          <h2 className="ab-sec-title">Everything You Need to Know</h2>
          <p className="ab-sec-sub">Comprehensive guides for a safe, informed and unforgettable Sikkim journey.</p>
        </div>

        {TRAVEL_SECTIONS.map((sec, si) => (
          <div key={si} className={`ab-ts ${sec.reverse ? "ab-ts--rev" : ""}`}>
            <div className="ab-ts-img">
              <img src={sec.img} alt={sec.title} />
              <div className="ab-ts-img-shade" />
            </div>
            <div className="ab-ts-content">
              <h3 className="ab-ts-title">{sec.title}</h3>
              <p className="ab-ts-intro">{sec.intro}</p>
              <div className="ab-ts-grid">
                {sec.items.map((item, ii) => (
                  <div key={ii} className="ab-ts-card">
                    <div className="ab-ts-card-icon">{item.icon}</div>
                    <div>
                      <h4 className="ab-ts-card-title">{item.title}</h4>
                      <p className="ab-ts-card-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ CTA ══ */}
      <section className="ab-cta" style={{ backgroundImage: `url(${CtaBg})` }}>
        <div className="ab-cta-orbs">
          <div className="ab-orb ab-orb1"/><div className="ab-orb ab-orb2"/>
        </div>
        <div className="ab-cta-inner">
          <span className="ab-badge ab-badge--light">🌿 Ready to Explore?</span>
          <h2 className="ab-cta-title">Sikkim Awaits You</h2>
          <p className="ab-cta-sub">Everything you need for a safe, guided and memorable Himalayan journey is right here.</p>
          <div className="ab-cta-btns">
            <a href="/places" className="ab-btn-primary ab-btn-lg">Explore Destinations →</a>
            <a href="/disaster-alerts" className="ab-btn-outline">Check Live Alerts</a>
          </div>
        </div>
      </section>

    </div>
  );
}