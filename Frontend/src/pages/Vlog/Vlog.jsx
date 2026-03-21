import React, { useState, useRef } from 'react';
import { Play, Pause, Heart, Share2, MapPin, Calendar, Camera, Mountain, TreePine, Snowflake, ChevronDown, ChevronUp } from 'lucide-react';
import './Vlog.css';
import { useNavigate } from 'react-router-dom';
import VlogHeroBg from '../../assets/North Sikkim/Gurudongmar Lake.jpg';
import CtaBg       from '../../assets/North Sikkim/Yumthang Valley.jpg';

const vlogData = [
  {
    id: 2,
    title: "Gangtok — The Capital's Charm",
    location: "East Sikkim",
    description: "Discover the vibrant streets of Gangtok, where traditional monasteries meet modern cafes. The perfect blend of culture and urban life in the mountains.",
    videoUrl: "https://www.shutterstock.com/shutterstock/videos/3425071967/preview/stock-footage-aerial-view-of-the-cloudy-day-in-gangtok-city-capital-of-sikkim-state-a-cable-car-riding-towards.webm",
    thumbnail: "https://plus.unsplash.com/premium_photo-1697730418140-064a5b6c2e17?w=600&auto=format&fit=crop&q=60",
    tags: ["Capital City", "Culture", "Urban"],
    likes: 189, date: "Dec 12, 2024", rating: 4.8,
    article: "Gangtok, the capital of Sikkim, is a vibrant city nestled in the Eastern Himalayas. Known for its clean streets, friendly locals, and a unique blend of tradition and modernity, Gangtok offers visitors a chance to explore monasteries, bustling markets, and scenic viewpoints.",
    points: ["Stroll along MG Marg, the heart of Gangtok's social life.", "Visit Enchey Monastery for a spiritual experience.", "Enjoy panoramic views from the Gangtok Ropeway.", "Sample local Sikkimese cuisine at authentic cafes.", "Shop for handicrafts and souvenirs at Lal Bazaar."]
  },
  {
    id: 3,
    title: "Nathula Pass — Indo-China Border",
    location: "East Sikkim",
    description: "Stand at one of the highest motorable passes in the world at 14,140 feet. Witness the historic trade route between India and China.",
    videoUrl: "https://www.shutterstock.com/shutterstock/videos/3838745423/preview/stock-footage-view-of-nathula-pass-china-boarder-sikkim.webm",
    thumbnail: "https://i.ytimg.com/vi/ZjUubdv_AO8/hq720.jpg",
    tags: ["Border", "High Altitude", "Historic"],
    likes: 312, date: "Dec 10, 2024", rating: 4.9,
    article: "Nathula Pass, located at 14,140 feet, is a historic mountain pass on the Indo-China border. Once part of the ancient Silk Route, it now offers travelers a glimpse into the high-altitude landscapes and the border gates between India and China.",
    points: ["Carry valid permits and warm clothing due to high altitude.", "Spot the Indo-China border gates and army posts.", "Visit Baba Harbhajan Singh Temple en route.", "Experience snow and dramatic Himalayan landscapes.", "Photography is restricted in certain areas — follow guidelines."]
  },
  {
    id: 4,
    title: "Yumthang Valley — Valley of Flowers",
    location: "North Sikkim",
    description: "Immerse yourself in the spectacular Yumthang Valley, known as the 'Valley of Flowers'. During spring, it transforms into a carpet of rhododendrons.",
    videoUrl: "https://www.shutterstock.com/shutterstock/videos/3821821551/preview/stock-footage-drone-footage-gliding-over-the-serene-summer-landscape-of-yumthang-valley-s-flower-covered.webm",
    thumbnail: "https://media.istockphoto.com/id/962097250/photo/purple-flowers-or-himalayan-primrose-at-yumthang-valley-sikkim-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=fkps1aVqsNJZxVM1TYg8lkyq4CfJfkhg-KYO9ofM77g=",
    tags: ["Flowers", "Valley", "Spring"],
    likes: 456, date: "Dec 8, 2024", rating: 4.7,
    article: "Yumthang Valley, often called the 'Valley of Flowers', is a paradise for nature lovers. In spring, the valley is carpeted with rhododendrons and alpine flowers. The Shingba Rhododendron Sanctuary and the hot springs are must-visit spots.",
    points: ["Best visited during spring for blooming rhododendrons.", "Relax in the natural Yumthang hot springs.", "Explore the Shingba Rhododendron Sanctuary.", "Ideal for nature walks and landscape photography.", "Spot grazing yaks and serene riverside meadows."]
  },
  {
    id: 5,
    title: "Pelling — Kanchenjunga Views",
    location: "West Sikkim",
    description: "Wake up to the majestic views of Kanchenjunga, the world's third-highest peak. Pelling offers spectacular sunrise views over the Himalayas.",
    videoUrl: "https://www.shutterstock.com/shutterstock/videos/3798158303/preview/stock-footage-sky-walk-at-giant-statue-chenrezing-pelling-sikkim-india.webm",
    thumbnail: "https://images.unsplash.com/photo-1724600457405-a7eeabcff6b5?w=600&auto=format&fit=crop&q=60",
    tags: ["Kanchenjunga", "Sunrise", "Himalayas"],
    likes: 378, date: "Dec 5, 2024", rating: 4.6,
    article: "Pelling is famous for its stunning views of Mount Kanchenjunga, the world's third-highest peak. The town is a base for exploring monasteries, waterfalls, and the Sky Walk.",
    points: ["Wake up early for sunrise views of Kanchenjunga.", "Walk the glass Sky Walk for a thrilling experience.", "Visit Pemayangtse Monastery, one of Sikkim's oldest.", "Explore Rabdentse Ruins for a glimpse of Sikkim's history.", "Enjoy local hospitality at boutique mountain resorts."]
  },
  {
    id: 6,
    title: "Rumtek Monastery",
    location: "East Sikkim",
    description: "Experience peace and spirituality at Rumtek Monastery, one of the most significant monasteries in Sikkim. Marvel at the intricate architecture.",
    videoUrl: "https://www.shutterstock.com/shutterstock/videos/3422962181/preview/stock-footage-gangtok-sikkim-india-april-ranka-monastery-or-lingdum-or-pal-zurmang-kagyud-monastery-in.webm",
    thumbnail: "https://media.istockphoto.com/id/2158470905/photo/a-majestic-buddhist-monastery-with-a-golden-roof-and-grand-staircase-sikkim-india.jpg?s=612x612&w=0&k=20&c=KILIYcDogr5bkpjzjiFQW8OsDRqEl5G_Jx5TsCrs62A=",
    tags: ["Monastery", "Buddhism", "Architecture"],
    likes: 267, date: "Dec 3, 2024", rating: 4.5,
    article: "Rumtek Monastery is one of the most important centers of Tibetan Buddhism in Sikkim. The monastery's architecture, murals, and peaceful ambiance attract visitors seeking spirituality and tranquility.",
    points: ["Attend the morning prayer session for a peaceful start.", "Admire the monastery's intricate murals and architecture.", "Learn about Tibetan Buddhism at the monastery museum.", "Walk the tranquil paths around the monastery complex.", "Respect customs and maintain silence inside prayer halls."]
  },
  {
    id: 7,
    title: "Namchi — Heart of South Sikkim",
    location: "South Sikkim",
    description: "Explore Namchi, the cultural and spiritual hub of South Sikkim, famous for its giant statues, monasteries, and lush tea gardens.",
    videoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbL39prVkpd0EbZsxu39bmDBlq2Nn1xbLfcT3yKAwU85Wm&s",
    thumbnail: "https://media.istockphoto.com/id/1136859823/photo/the-huge-statue-of-shiva-in-namchi-chardham-in-the-state-of-sikkim-india.jpg?s=612x612&w=0&k=20&c=0CVDrfRwnf-N5jHRtQDXKt3_6I0XbTaPhCShUmJE5Z0=",
    tags: ["Culture", "Spirituality", "Tea Garden"],
    likes: 123, date: "Dec 18, 2024", rating: 4.4,
    article: "Namchi, meaning 'Sky High', is the cultural and spiritual heart of South Sikkim. The town is known for its giant statues, including the 135-feet tall Guru Padmasambhava, and the Char Dham complex.",
    points: ["Visit the towering Guru Padmasambhava statue at Samdruptse.", "Explore the Char Dham complex with replicas of India's holy shrines.", "Stroll through lush tea gardens and sample local teas.", "Discover peaceful Ngadak and Tendong Hill monasteries.", "Enjoy panoramic views of the Himalayas and valleys."]
  },
];

const LOC = {
  "East Sikkim":  { bg:"#d1fae5", txt:"#065f46", dot:"#10b981" },
  "North Sikkim": { bg:"#dbeafe", txt:"#1e40af", dot:"#3b82f6" },
  "West Sikkim":  { bg:"#ede9fe", txt:"#5b21b6", dot:"#8b5cf6" },
  "South Sikkim": { bg:"#fef3c7", txt:"#92400e", dot:"#f59e0b" },
};

export default function Vlog() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [likes, setLikes]             = useState({});
  const [expanded, setExpanded]       = useState({});
  const videoRefs = useRef({});
  const navigate  = useNavigate();

  const toggleVideo = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;
    if (activeVideo === id) {
      video.pause();
      setActiveVideo(null);
    } else {
      Object.values(videoRefs.current).forEach(v => { if (v && v !== video) { v.pause(); v.currentTime = 0; } });
      video.play().catch(() => {});
      setActiveVideo(id);
    }
  };

  const toggleLike   = (id) => setLikes(p => ({ ...p, [id]: !p[id] }));
  const toggleExpand = (id) => setExpanded(p => ({ [id]: !p[id] }));

  const handleShare = (vlog) => {
    if (navigator.share) {
      navigator.share({ title: vlog.title, text: vlog.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  return (
    <div className="vl">

      {/* ── HERO ── */}
      <section className="vl-hero" style={{ backgroundImage: `url(${VlogHeroBg})` }}>
        <div className="vl-hero-inner">
          <div className="vl-hero-cam"><Camera size={40} strokeWidth={1.5} /></div>
          <span className="vl-eyebrow">✦ Sikkim Travel Blogs</span>
          <h1 className="vl-hero-title">Journey Through<br /><em>The Himalayas</em></h1>
          <p className="vl-hero-sub">Immersive video stories from the mystical lands of Sikkim — breathtaking beauty, rich culture and serene spirituality.</p>
          <div className="vl-hero-pills">
            <span className="vl-pill"><Mountain size={13} />High Altitude</span>
            <span className="vl-pill"><TreePine size={13} />Natural Wonders</span>
            <span className="vl-pill"><Snowflake size={13} />Alpine Life</span>
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="vl-body">
        <div className="vl-sec-hdr">
          <span className="vl-eyebrow">✦ Latest Episodes</span>
          <h2 className="vl-sec-title">Blog Stories</h2>
          <p className="vl-sec-sub">Curated short video stories capturing the essence of this magical Himalayan state.</p>
        </div>

        <div className="vl-grid">
          {vlogData.map((v, idx) => {
            const loc    = LOC[v.location] || LOC["East Sikkim"];
            const isPlay = activeVideo === v.id;
            const isExp  = expanded[v.id];
            const liked  = likes[v.id];

            return (
              <article key={v.id} className="vl-card" style={{ animationDelay:`${idx*0.07}s` }}>

                {/* ── Media ── */}
                <div className="vl-media">
                  <img src={v.thumbnail} alt={v.title} className="vl-thumb" style={{ opacity: isPlay ? 0 : 1 }} />
                  <video
                    ref={el => videoRefs.current[v.id] = el}
                    src={v.videoUrl} loop muted playsInline preload="metadata"
                    className="vl-video" style={{ opacity: isPlay ? 1 : 0 }}
                  />

                  {/* Play button */}
                  <button className={`vl-play-btn ${isPlay ? "playing" : ""}`} onClick={() => toggleVideo(v.id)}>
                    <span className="vl-play-ring" />
                    {isPlay ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  {/* Badges */}
                  <span className="vl-loc" style={{ background: loc.bg, color: loc.txt }}>
                    <span className="vl-loc-dot" style={{ background: loc.dot }} />
                    <MapPin size={11} />{v.location}
                  </span>
                  <span className="vl-rating">⭐ {v.rating}</span>

                  {/* Hover hint */}
                  {!isPlay && <div className="vl-hover-hint"><span>Click to play</span></div>}
                </div>

                {/* ── Content ── */}
                <div className="vl-content">
                  <div className="vl-tags">
                    {v.tags.map((t, i) => <span key={i} className="vl-tag">{t}</span>)}
                  </div>

                  <h3 className="vl-title">{v.title}</h3>
                  <p className="vl-desc">{v.description}</p>

                  {/* Expanded article */}
                  {isExp && (
                    <div className="vl-article">
                      <p>{v.article}</p>
                      <ul>
                        {v.points.map((pt, i) => <li key={i}><span>→</span>{pt}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="vl-card-footer">
                    <div className="vl-footer-left">
                      <span className="vl-date"><Calendar size={13} />{v.date}</span>
                      <button className="vl-readmore" onClick={() => toggleExpand(v.id)}>
                        {isExp ? <><ChevronUp size={14}/>Show less</> : <><ChevronDown size={14}/>Read more</>}
                      </button>
                    </div>
                    <div className="vl-actions">
                      <button className={`vl-like ${liked ? "liked" : ""}`} onClick={() => toggleLike(v.id)}>
                        <Heart size={17} className={liked ? "filled" : ""} />
                        <span>{v.likes + (liked ? 1 : 0)}</span>
                      </button>
                      <button className="vl-share" onClick={() => handleShare(v)}>
                        <Share2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── CTA ── */}
        <div className="vl-cta" style={{ backgroundImage: `url(${CtaBg})` }}>
          <span className="vl-eyebrow">✦ Dive Deeper</span>
          <h2 className="vl-cta-title">Explore All Articles</h2>
          <p className="vl-cta-sub">Detailed guides, permit info and insider tips for every corner of Sikkim.</p>
          <button className="vl-cta-btn" onClick={() => navigate('/article')}>Read All Articles →</button>
        </div>
      </div>

    </div>
  );
}