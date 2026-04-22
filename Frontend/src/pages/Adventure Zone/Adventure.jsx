import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  X, Play, Pause, Volume2, VolumeX,
  ChevronRight, Filter, ArrowRight,
  MapPin, Clock, Star, Phone, Navigation,
  Users, Award, Check, ChevronDown,
  Bike, Mountain, Waves, Wind, Camera, Tent
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import styles from "./Adventure.module.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ─── DATA ─────────────────────────────────────────────────────────────────────

const touristPlaces = [
  { id: 1,  name: "Kanchenjunga Base Camp", type: "Trek", coordinates: [27.7025, 88.1475], desc: "Trek to the world's 3rd highest peak base camp through pristine alpine wilderness.", difficulty: "Extreme", duration: "12-15 days", bestTime: "May–Oct", icon: "🏔️", color: "#ef4444", tag: "Iconic" },
  { id: 2,  name: "Gurudongmar Lake",        type: "Sacred Lake", coordinates: [27.6833, 88.75],   desc: "One of the world's highest lakes at 17,800 ft, sacred to both Buddhists and Hindus.", difficulty: "Moderate", duration: "2-3 days", bestTime: "May–Oct", icon: "💧", color: "#3b82f6", tag: "Spiritual" },
  { id: 3,  name: "Yumthang Valley",         type: "Valley",     coordinates: [27.75,   88.7],    desc: "The Valley of Flowers — stunning rhododendron blooms at 11,800 ft every spring.", difficulty: "Easy",     duration: "1-2 days", bestTime: "Apr–Jun", icon: "🌸", color: "#a855f7", tag: "Scenic" },
  { id: 4,  name: "Nathu La Pass",           type: "Pass",       coordinates: [27.3917, 88.8417], desc: "Historic Silk Route mountain pass at 14,140 ft on the India-China border.", difficulty: "Moderate", duration: "1 day",    bestTime: "May–Oct", icon: "🏔️", color: "#f97316", tag: "Historic" },
  { id: 5,  name: "Tsomgo Lake",             type: "Lake",       coordinates: [27.35,   88.75],   desc: "Sacred glacial lake at 12,310 ft, shimmering turquoise surrounded by steep slopes.", difficulty: "Easy",     duration: "1 day",    bestTime: "Mar–Dec", icon: "❄️", color: "#06b6d4", tag: "Popular" },
  { id: 6,  name: "Zuluk Silk Route",        type: "Heritage",   coordinates: [27.2167, 88.7167], desc: "Ancient Silk Route village with 32 hairpin bends and panoramic Himalayan views.", difficulty: "Moderate", duration: "2-3 days", bestTime: "Oct–May", icon: "🛤️", color: "#10b981", tag: "Heritage" },
  { id: 7,  name: "Pelling",                 type: "Town",       coordinates: [27.2985, 88.1182], desc: "Panoramic views of Kanchenjunga from Pelling town with nearby monasteries.", difficulty: "Easy",     duration: "2 days",   bestTime: "Oct–May", icon: "🏘️", color: "#8b5cf6", tag: "Popular" },
  { id: 8,  name: "Rumtek Monastery",        type: "Monastery",  coordinates: [27.3012, 88.6177], desc: "One of the largest Buddhist monasteries in Sikkim, vibrant center of Karma Kagyu.", difficulty: "Easy",     duration: "Half day", bestTime: "All year", icon: "🛕", color: "#f59e0b", tag: "Cultural" },
  { id: 9,  name: "Teesta River Rafting",    type: "Adventure",  coordinates: [27.1667, 88.5167], desc: "Thrilling Grade III–IV white water rafting through stunning Himalayan gorges.", difficulty: "Hard",     duration: "Half day", bestTime: "Oct–Apr", icon: "🚣", color: "#2563eb", tag: "Thrill" },
  { id: 10, name: "Ravangla",                type: "Town",       coordinates: [27.3055, 88.3625], desc: "Home to the 130 ft Buddha Park statue with panoramic south Sikkim views.", difficulty: "Easy",     duration: "1 day",    bestTime: "All year", icon: "🧘", color: "#84cc16", tag: "Spiritual" },
  { id: 11, name: "Lachen",                  type: "Village",    coordinates: [27.7267, 88.5617], desc: "Gateway village to Gurudongmar Lake — traditional Lepcha settlement at 8,700 ft.", difficulty: "Easy",     duration: "1 day",    bestTime: "May–Oct", icon: "🏡", color: "#fb7185", tag: "Village" },
  { id: 12, name: "Khangchendzonga NP",      type: "Park",       coordinates: [27.6106, 88.1494], desc: "UNESCO World Heritage Site — diverse wildlife, glaciers, sacred sites.", difficulty: "Hard",     duration: "3-5 days", bestTime: "May–Nov", icon: "🌿", color: "#22c55e", tag: "UNESCO" },
];

const bikeVendors = [
  { id: 1,  name: "Himalayan Riders Sikkim",     location: "MG Marg, Gangtok",      phone: "+91 98320 11234", rating: 4.8, reviews: 142, bikes: ["RE Himalayan 411", "RE Classic 350", "Honda Activa"], priceFrom: 800,  open: "8am–7pm", verified: true,  img: "🏍️" },
  { id: 2,  name: "Sikkim Adventure Wheels",     location: "Tadong, Gangtok",        phone: "+91 97334 56789", rating: 4.6, reviews: 98,  bikes: ["RE Thunderbird 350", "Bajaj Dominar 250", "Honda CB Shine"], priceFrom: 700,  open: "7am–8pm", verified: true,  img: "🛵" },
  { id: 3,  name: "Mountain Gear Rentals",       location: "Ranipool, Gangtok",      phone: "+91 89721 33445", rating: 4.7, reviews: 211, bikes: ["RE Himalayan", "Trek MTB", "Hero Splendor+"], priceFrom: 400,  open: "8am–6pm", verified: true,  img: "🚵" },
  { id: 4,  name: "Northeast Bike Hub",          location: "Pelling, West Sikkim",   phone: "+91 70449 88120", rating: 4.5, reviews: 67,  bikes: ["RE Classic 350", "RE Electra", "Honda Activa 6G"], priceFrom: 600,  open: "9am–6pm", verified: false, img: "🏍️" },
  { id: 5,  name: "Kanchenjunga Bike Rentals",   location: "National Highway, Siliguri", phone: "+91 93320 77654", rating: 4.4, reviews: 184, bikes: ["RE Bullet 350", "Bajaj Pulsar 150", "Hero Passion"], priceFrom: 500,  open: "7am–9pm", verified: true,  img: "🛵" },
  { id: 6,  name: "Sikkim MTB & Trail Co.",      location: "Ravangla, South Sikkim", phone: "+91 85920 44321", rating: 4.9, reviews: 55,  bikes: ["Trek Marlin 7 MTB", "Giant Talon MTB", "Cannondale Trail"], priceFrom: 450,  open: "8am–5pm", verified: true,  img: "🚵" },
  { id: 7,  name: "Gangtok Scooter Point",       location: "31A, Gangtok",           phone: "+91 97480 22134", rating: 4.3, reviews: 299, bikes: ["Honda Activa 6G", "TVS Jupiter", "Suzuki Access"], priceFrom: 350,  open: "8am–8pm", verified: false, img: "🛵" },
  { id: 8,  name: "Summit Riders Lachung",       location: "Lachung Village",        phone: "+91 96419 88765", rating: 4.7, reviews: 43,  bikes: ["RE Himalayan 411", "Hero Xpulse 200"], priceFrom: 1200, open: "7am–6pm", verified: true,  img: "🏍️" },
];

const adventures = [
  { id: 1, icon: "🏍️", name: "Bike Rental",    desc: "RE, scooters & MTBs",    count: "8 vendors",  cat: "Biking",  col: "#f97316" },
  { id: 2, icon: "🚣", name: "River Rafting",  desc: "Teesta Grade III–IV",    count: "4 operators",cat: "Water",   col: "#3b82f6" },
  { id: 3, icon: "🥾", name: "Trekking",       desc: "30+ mapped trails",      count: "30+ trails", cat: "Trek",    col: "#22c55e" },
  { id: 4, icon: "🪂", name: "Paragliding",    desc: "Tandem flights, Pelling", count: "3 sites",    cat: "Sky",     col: "#a855f7" },
  { id: 5, icon: "⛺", name: "Camping",        desc: "Alpine basecamps",       count: "10 camps",   cat: "Camp",    col: "#06b6d4" },
  { id: 6, icon: "🎿", name: "Snow Sports",    desc: "Seasonal skiing",        count: "2 zones",    cat: "Winter",  col: "#64748b" },
  { id: 7, icon: "🧗", name: "Rock Climbing",  desc: "Guided climbing routes", count: "5 peaks",    cat: "Climb",   col: "#f59e0b" },
  { id: 8, icon: "📸", name: "Photo Tours",    desc: "Sunrise & landscape",    count: "200+ spots", cat: "Photo",   col: "#ec4899" },
];

const heroStats = [
  { val: "12+",  lbl: "Adventure Types" },
  { val: "97%",  lbl: "Satisfaction Rate" },
  { val: "85+",  lbl: "Expert Guides" },
  { val: "245+", lbl: "Happy Travellers" },
];

// ── LEAFLET ICON FACTORY ──────────────────────────────────────────────────────

const makeIcon = (color, emoji, size = 36) => L.divIcon({
  html: `<div style="
    background:${color};width:${size}px;height:${size}px;
    border-radius:50% 50% 50% 0;border:3px solid #fff;
    box-shadow:0 4px 14px ${color}66;
    display:flex;align-items:center;justify-content:center;
    font-size:${size * 0.42}px;transform:rotate(-45deg);
  "><span style="transform:rotate(45deg)">${emoji}</span></div>`,
  className: "",
  iconSize: [size, size],
  iconAnchor: [size / 2, size],
  popupAnchor: [0, -(size + 4)],
});

const MapEvt = ({ setZ }) => {
  const map = useMapEvents({ zoomend: () => setZ(map.getZoom()) });
  return null;
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

const Adventure = () => {
  const navigate = useNavigate();
  const [showVendors, setShowVendors] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [mapZoom, setMapZoom] = useState(9);
  const [activeFilter, setActiveFilter] = useState("All");
  const [vendorFilter, setVendorFilter] = useState("All");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  // Live bikes from database
  const [liveBikes, setLiveBikes] = useState([]);
  const [bikesLoading, setBikesLoading] = useState(false);

  // Fetch live approved bikes when vendor modal opens
  useEffect(() => {
    if (!showVendors) return;
    setBikesLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/bikes`)
      .then((r) => r.json())
      .then((d) => setLiveBikes(d.bikes || []))
      .catch(() => setLiveBikes([]))
      .finally(() => setBikesLoading(false));
  }, [showVendors]);

  // Auth-aware Book Now handler
  const handleBikeBookNow = (bikeId) => {
    const userToken = localStorage.getItem("userToken");
    const ownerToken = localStorage.getItem("ownerToken");
    if (userToken || ownerToken) {
      navigate(`/bikes/${bikeId}`);
    } else {
      // Not logged in — send to traveler login, come back after
      navigate("/traveler-login", { state: { from: `/bikes/${bikeId}` } });
    }
  };

  // Show all bikes list even if user taps the generic card
  const handleViewAllBikes = () => navigate("/bikes");


  const diffColors = { Easy: "#16a34a", Moderate: "#d97706", Hard: "#dc2626", Extreme: "#9333ea" };
  // Vendor filter uses live bikes when available, falls back to static data
  const displayBikes = liveBikes.length > 0 ? liveBikes : bikeVendors;
  const filteredVendors = vendorFilter === "All"
    ? displayBikes
    : displayBikes.filter((v) => (v.location || "").toLowerCase().includes(vendorFilter.toLowerCase()));
  const filteredAdv = activeFilter === "All" ? adventures : adventures.filter((a) => a.cat === activeFilter);

  const openLocation = (loc) => { setActiveLocation(loc); setShowDetailModal(true); };
  const togglePlay = () => { if (videoRef.current) { isPlaying ? videoRef.current.pause() : videoRef.current.play(); setIsPlaying(!isPlaying); } };
  const toggleMute = () => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } };

  return (
    <div className={styles.root}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <div className={styles.heroWrapper}>
      <div className={styles.hero}>
        {/* Left column — main image + glassmorphism info cards */}
        <div className={styles.heroImgCol}>
          <div className={styles.heroImgMain} style={{ backgroundImage: "url('https://leavetheroad.in/wp-content/uploads/2025/08/20240729_113011.jpg')" }}>
            <div className={styles.heroImgOverlay} />
          </div>

          {/* Glass info strip replacing the two small images */}
          <div className={styles.heroInfoStrip}>
            <div className={styles.heroInfoCard}>
              <span className={styles.heroInfoIcon}>🥾</span>
              <div>
                <strong>30+ Trails</strong>
                <span>Trekking routes</span>
              </div>
            </div>
            <div className={styles.heroInfoDivider} />
            <div className={styles.heroInfoCard}>
              <span className={styles.heroInfoIcon}>🚣</span>
              <div>
                <strong>Grade III–IV</strong>
                <span>River rafting</span>
              </div>
            </div>
            <div className={styles.heroInfoDivider} />
            <div className={styles.heroInfoCard}>
              <span className={styles.heroInfoIcon}>🪂</span>
              <div>
                <strong>3 Sites</strong>
                <span>Paragliding</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>🧭 Sikkim Adventure Guide</span>
          <h1 className={styles.heroTitle}>
            Explore<br />
            <span>unforgettable</span><br />
            destinations
          </h1>
          <p className={styles.heroSubtitle}>
            Journey beyond the ordinary — discover Sikkim's mountains, valleys, and hidden wonders.
          </p>

          {/* ── DECORATIVE PANEL (replaces booking widget) ── */}
          <div className={styles.heroDecor}>
            <div className={styles.heroDecorCard}>

              {/* Top row: label + live indicator */}
              <div className={styles.heroDecorTop}>
                {/* <span className={styles.heroDecorLabel}>✦ Live Destinations</span>
                <span className={styles.heroDecorLive}>
                  <span className={styles.heroDecorPulseDot} />
                  Open for bookings
                </span> */}
              </div>

              {/* Destination pills */}
              <div className={styles.heroDecorPills}>
                {[
                  { icon: "🏔️", label: "Kanchenjunga", color: "#ef4444" },
                  { icon: "💧", label: "Gurudongmar",   color: "#3b82f6" },
                  { icon: "🌸", label: "Yumthang",      color: "#a855f7" },
                  { icon: "🛕", label: "Rumtek",         color: "#f59e0b" },
                  { icon: "🚣", label: "Teesta Rafting", color: "#2563eb" },
                  { icon: "🛤️", label: "Silk Route",    color: "#10b981" },
                ].map(p => (
                  <span key={p.label} className={styles.heroDecorPill}>
                    <span className={styles.heroDecorPillDot} style={{ background: p.color }} />
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>

              <hr className={styles.heroDecorDivider} />

              {/* Bottom row: weather + altitude + CTA */}
              <div className={styles.heroDecorRow}>
                <span className={styles.heroDecorWeather}>
                  🌡️ 8°C – 22°C &nbsp;·&nbsp; Best season now
                </span>
                <span className={styles.heroDecorAlt}>⛰️ 8,586m</span>
                <button className={styles.heroDecorCTA} onClick={() => setShowMapModal(true)}>
                  Explore Map →
                </button>
              </div>

            </div>
          </div>

          {/* Stats */}
          <div className={styles.heroStats}>
            {heroStats.map((s) => (
              <div key={s.lbl} className={styles.heroStat}>
                <span className={styles.heroStatVal}>{s.val}</span>
                <span className={styles.heroStatLbl}>{s.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>{/* end heroWrapper */}

      {/* ══════════════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════════════ */}
      <div className={styles.marqueeStrip}>
        <div className={styles.marqueeTrack}>
          {["Kanchenjunga", "Tsomgo Lake", "Nathu La Pass", "Yumthang Valley", "Teesta River", "Rumtek Monastery", "Pelling", "Gurudongmar Lake", "Silk Route", "Khangchendzonga NP"].map(s => (
            <span key={s} className={styles.marqueeItem}><span className={styles.marqueeDot}>✦</span>{s}</span>
          ))}
          {["Kanchenjunga", "Tsomgo Lake", "Nathu La Pass", "Yumthang Valley", "Teesta River", "Rumtek Monastery", "Pelling", "Gurudongmar Lake", "Silk Route", "Khangchendzonga NP"].map(s => (
            <span key={s + "2"} className={styles.marqueeItem} aria-hidden><span className={styles.marqueeDot}>✦</span>{s}</span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION: EXPLORE DESTINATIONS
      ══════════════════════════════════════════ */}
      <section className={styles.sec}>
        <div className={styles.secHead}>
          <div>
            <p className={styles.secEye}>Experience Our Destinations</p>
            <h2 className={styles.secH2}>Explore Sikkim's Best</h2>
          </div>
          <button className={styles.mapOpenBtn} onClick={() => setShowMapModal(true)}>
            <MapPin size={16} /> View All on Map
          </button>
        </div>

        <div className={styles.destinationGrid}>
          {touristPlaces.slice(0, 6).map((pl, i) => (
            <div key={pl.id} className={`${styles.destCard} ${i === 0 ? styles.destCardFeatured : ""}`} onClick={() => openLocation(pl)}>
              <div className={styles.destCardImg} style={{
                backgroundImage: `url('https://images.unsplash.com/photo-${[
                  "1506905925346-21bda4d32df4",
                  "1464822759023-fed622ff2c3b",
                  "1537225228614-56cc3556d7ed",
                  "1538576294001-022ea161539d",
                  "1504280390367-361c6d9f38f4",
                  "1551632811-561732d1e306"
                ][i]}?w=400&q=60&auto=format&fit=crop')`
              }}>
                <div className={styles.destImgOver} />
                <span className={styles.destTag} style={{ background: pl.color }}>{pl.tag}</span>
                <div className={styles.destCardBottom}>
                  <h3>{pl.name}</h3>
                  <p>{pl.type} · {pl.bestTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.viewAllWrap}>
          <button className={styles.viewAllBtn} onClick={() => setShowMapModal(true)}>
            View All {touristPlaces.length} Destinations on Map <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TAGLINE BREAK
      ══════════════════════════════════════════ */}
      <div className={styles.tagline}>
        <h2>
          Take the step and explore{" "}
          <span className={styles.taglineImgInline} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60&auto=format&fit=crop')" }} />{" "}
          the world{" "}
          <span className={styles.taglineImgInline} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=60&auto=format&fit=crop')" }} />{" "}
          waiting for you.
        </h2>
        <p>Travelling changes you. You see new places, meet new people, and become a new version of yourself.</p>
      </div>

      {/* ══════════════════════════════════════════
          SECTION: ADVENTURES
      ══════════════════════════════════════════ */}
      <section className={`${styles.sec} ${styles.secGray}`}>
        <div className={styles.secGrayInner}>
        <div className={styles.secHead}>
          <div>
            <p className={styles.secEye}>Get a good travel experience</p>
            <h2 className={styles.secH2}>All Adventures</h2>
          </div>
          <div className={styles.filterPills}>
            {["All", "Biking", "Water", "Trek", "Sky", "Camp"].map(f => (
              <button key={f} className={`${styles.fPill} ${activeFilter === f ? styles.fPillOn : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className={styles.advGrid}>
          {filteredAdv.map((a) => (
            <div key={a.id} className={styles.advCard} style={{ "--ac": a.col }}
              onClick={() => a.cat === "Biking" ? setShowVendors(true) : null}>
              <div className={styles.advCardTop} style={{ background: `${a.col}12` }}>
                <span className={styles.advIcon}>{a.icon}</span>
              </div>
              <div className={styles.advCardBody}>
                <div className={styles.advCardMeta}>
                  <span className={styles.advCount} style={{ color: a.col, background: `${a.col}15` }}>{a.count}</span>
                </div>
                <h3 className={styles.advName}>{a.name}</h3>
                <p className={styles.advDesc}>{a.desc}</p>
              <button className={styles.advBtn} style={{ color: a.col }}
                onClick={(e) => { e.stopPropagation(); a.cat === "Biking" ? setShowVendors(true) : null; }}>
                {a.cat === "Biking" ? "View Vendors →" : ""}
              </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: WHY SIKKIM
      ══════════════════════════════════════════ */}
      <section className={styles.sec}>
        <div className={styles.whyGrid}>
          <div className={styles.whyLeft}>
            <p className={styles.secEye}>Travelling brings you closer</p>
            <h2 className={styles.secH2}>to new places, people<br />& experiences.</h2>
            <p className={styles.whyP}>Sikkim offers an unmatched combination of Himalayan peaks, crystal lakes, ancient monasteries, and warm local culture — all in one compact, breathtaking state.</p>
            <div className={styles.whyFeatures}>
              {["UNESCO World Heritage Sites", "Over 30 trekking routes", "Rich Buddhist culture", "Year-round adventure options"].map(f => (
                <div key={f} className={styles.whyFeature}>
                  <span className={styles.whyCheck}><Check size={13} /></span>
                  {f}
                </div>
              ))}
            </div>
            <button className={styles.whyBtn} onClick={() => setShowMapModal(true)}>
              Discover Destinations <ArrowRight size={15} />
            </button>
          </div>
          <div className={styles.whyRight}>
            <div className={styles.whyImgGrid}>
              <div className={styles.whyImg1} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60&auto=format&fit=crop')" }} />
              <div className={styles.whyImg2} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=60&auto=format&fit=crop')" }} />
              <div className={styles.whyImg3} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=400&q=60&auto=format&fit=crop')" }} />
              <div className={styles.whyBadge}>
                <span className={styles.whyBadgeNum}>4.9</span>
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <span className={styles.whyBadgeLbl}>Top rated destination</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: BIKE RENTAL CTA
      ══════════════════════════════════════════ */}
      <section className={styles.bikeCTA}>
        <div className={styles.bikeCTAInner}>
        <div className={styles.bikeCTALeft}>
          <span className={styles.bikeCTAEye}>🏍️ Explore on Two Wheels</span>
          <h2>Rent a Bike &<br />Ride Sikkim Free</h2>
          <p>From Royal Enfield Himalayans to mountain bikes — we have the right wheels for every road.</p>
          <div className={styles.bikeCTABtns}>
            <button className={styles.bikeCTAMain} onClick={() => setShowVendors(true)}>
              View All Bike Vendors
            </button>
            <button className={styles.bikeCTASecondary} onClick={() => setShowMapModal(true)}>
              <MapPin size={15} /> Route Map
            </button>
          </div>
        </div>
        <div className={styles.bikeCTARight}>
          <div className={styles.bikePreview}>
            <div className={styles.bikePreviewImg} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558981852-426c349548ab?w=400&q=60&auto=format&fit=crop')" }} />
            <div className={styles.bikePreviewCard}>
              <div className={styles.bpIcon}>🏍️</div>
              <div>
                <strong>RE Himalayan 411</strong>
                <span>From ₹800/day</span>
              </div>
              <button className={styles.bpBook} onClick={() => setShowVendors(true)}>Book</button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MODAL: BIKE VENDORS
      ══════════════════════════════════════════ */}
      {showVendors && (
        <div className={styles.modalBack} onClick={(e) => e.target === e.currentTarget && setShowVendors(false)}>
          <div className={styles.vendorModal}>
            <div className={styles.vendorModalHead}>
              <div>
                <h2>🏍️ Bike Rental Vendors</h2>
                <p>{bikesLoading ? "Loading..." : `${filteredVendors.length} vendor(s) available across Sikkim`}</p>
              </div>
              <button className={styles.modalClose} onClick={() => setShowVendors(false)}><X size={20} /></button>
            </div>

            {/* Filter by location */}
            <div className={styles.vendorFilters}>
              <span className={styles.vendorFilterLbl}><Filter size={13} /> Filter by location:</span>
              {["All", "Gangtok", "Pelling", "Lachung", "Ravangla", "Siliguri"].map(loc => (
                <button key={loc} className={`${styles.vFChip} ${vendorFilter === loc ? styles.vFOn : ""}`} onClick={() => setVendorFilter(loc)}>{loc}</button>
              ))}
            </div>

            <div className={styles.vendorList}>
              {bikesLoading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>Loading live bikes...</div>
              ) : filteredVendors.map((v, i) => (
                <div key={v._id || v.id} className={styles.vendorCard} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={styles.vendorRank}>#{i + 1}</div>
                  <div className={styles.vendorEmoji}>
                    {v.images && v.images.length > 0 ? (
                      <img
                        src={v.images[0].startsWith("http") ? v.images[0] : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${v.images[0]}`}
                        alt={v.name}
                        className={styles.vendorBikeImg}
                      />
                    ) : (
                      v.img || "🏍️"
                    )}
                  </div>
                  <div className={styles.vendorBody}>
                    <div className={styles.vendorTop}>
                      <h3>{v.name}</h3>
                      {(v.verified || v.isApproved) && <span className={styles.verifiedBadge}><Check size={10} /> Verified</span>}
                    </div>
                    <div className={styles.vendorMeta}>
                      <span><MapPin size={12} /> {v.location}</span>
                      {v.open && <span><Clock size={12} /> {v.open}</span>}
                      <span><Phone size={12} /> {v.phone || v.contactNumber}</span>
                    </div>
                    <div className={styles.vendorBikes}>
                      {(v.bikes || (v.name ? [v.name] : [])).map((b) => <span key={b} className={styles.vBikeChip}>{b}</span>)}
                    </div>
                  </div>
                  <div className={styles.vendorRight}>
                    <div className={styles.vendorRating}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <strong>{v.rating || "New"}</strong>
                      {v.reviews && <span>({v.reviews})</span>}
                    </div>
                    <div className={styles.vendorPrice}>
                      <span className={styles.vendorFrom}>From</span>
                      <span className={styles.vendorPriceNum}>₹{v.priceFrom || v.dailyRate}</span>
                      <span className={styles.vendorPerDay}>/day</span>
                    </div>
                    <button
                      className={styles.vendorBookBtn}
                      onClick={() => v._id ? handleBikeBookNow(v._id) : handleViewAllBikes()}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: FULL MAP (all tourist places)
      ══════════════════════════════════════════ */}
      {showMapModal && (
        <div className={styles.modalBack} onClick={(e) => e.target === e.currentTarget && setShowMapModal(false)}>
          <div className={styles.mapModal}>
            <div className={styles.mapModalHead}>
              <div>
                <h2>🗺️ Sikkim Tourist Map</h2>
                <p>{touristPlaces.length} places to visit — click any pin for details</p>
              </div>
              <button className={styles.modalClose} onClick={() => setShowMapModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.mapModalBody}>
              {/* Sidebar list */}
              <div className={styles.mapSidebar}>
                <div className={styles.mapSidebarTitle}>All Destinations</div>
                {touristPlaces.map(pl => (
                  <div key={pl.id} className={styles.mapSideItem} onClick={() => openLocation(pl)}>
                    <span className={styles.mapSideDot} style={{ background: pl.color }} />
                    <div className={styles.mapSideText}>
                      <strong>{pl.name}</strong>
                      <span>{pl.type} · {pl.difficulty}</span>
                    </div>
                    <ChevronRight size={13} className={styles.mapSideArr} />
                  </div>
                ))}
              </div>

              {/* The map */}
              <div className={styles.mapFrame}>
                <MapContainer center={[27.45, 88.55]} zoom={9} style={{ height: "100%", width: "100%" }} zoomControl={true}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                  {touristPlaces.map(pl => (
                    <Marker key={pl.id} position={pl.coordinates} icon={makeIcon(pl.color, pl.icon)}
                      eventHandlers={{ click: () => openLocation(pl) }}>
                      <Popup>
                        <div className={styles.mapPopup}>
                          <div className={styles.mapPopupBar} style={{ background: pl.color }} />
                          <h4 style={{ color: pl.color }}>{pl.name}</h4>
                          <span className={styles.mapPopupType}>{pl.type}</span>
                          <p>{pl.desc.substring(0, 80)}…</p>
                          <div className={styles.mapPopupRow}>
                            <span className={styles.mapDiff} style={{ background: `${diffColors[pl.difficulty]}18`, color: diffColors[pl.difficulty] }}>{pl.difficulty}</span>
                            <span className={styles.mapDur}>{pl.duration}</span>
                          </div>
                          <button className={styles.mapPopupBtn} style={{ background: pl.color }} onClick={() => openLocation(pl)}>View Details →</button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <MapEvt setZ={setMapZoom} />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: LOCATION DETAIL
      ══════════════════════════════════════════ */}
      {/* {showDetailModal && activeLocation && (
        <div className={styles.modalBack} onClick={(e) => e.target === e.currentTarget && setShowDetailModal(false)}>
          <div className={styles.detailModal}>
            <button className={styles.modalClose} style={{ position: "absolute", top: "1.25rem", right: "1.25rem" }} onClick={() => setShowDetailModal(false)}><X size={20} /></button>

            <div className={styles.detailHero} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60&auto=format&fit=crop')` }}>
              <div className={styles.detailHeroOver} />
              <div className={styles.detailHeroContent}>
                <span className={styles.detailTag} style={{ background: activeLocation.color }}>{activeLocation.tag}</span>
                <h2>{activeLocation.name}</h2>
                <p>{activeLocation.type}</p>
              </div>
            </div>

            <div className={styles.detailBody}>
              <div className={styles.detailLeft}>
                <p className={styles.detailDesc}>{activeLocation.desc}</p>
                <div className={styles.detailStats}>
                  {[
                    { k: "Difficulty", v: activeLocation.difficulty, special: true },
                    { k: "Duration",   v: activeLocation.duration },
                    { k: "Best Time",  v: activeLocation.bestTime },
                    { k: "Type",       v: activeLocation.type },
                  ].map(d => (
                    <div key={d.k} className={styles.detailStat}>
                      <span className={styles.detailK}>{d.k}</span>
                      <span className={styles.detailV}
                        style={d.special ? { background: `${diffColors[activeLocation.difficulty]}18`, color: diffColors[activeLocation.difficulty] } : {}}>
                        {d.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.detailRight}>
                <div className={styles.vidWrap}>
                  <video ref={videoRef} className={styles.vid}
                    poster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60&auto=format&fit=crop"
                    onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                    <source src={activeLocation.videoUrl} type="video/mp4" />
                  </video>
                  <div className={styles.vidCtrl}>
                    <button className={styles.vidBtn} onClick={togglePlay}>{isPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
                    <button className={styles.vidBtn} onClick={toggleMute}>{isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
                  </div>
                </div>
                <button className={styles.detailCTA} style={{ background: activeLocation.color }}>Plan This Trip →</button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Adventure;