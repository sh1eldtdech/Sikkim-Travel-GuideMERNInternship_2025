import { useState, useEffect, useCallback } from "react";
import { WEATHER_DISTRICTS, ROAD_ROUTES } from "./DisasterConstants";

// ── Helpers ──────────────────────────────────────────────────────────────────

export function wxIcon(c) {
  if (c === 0) return "☀️";
  if (c <= 3)  return "⛅";
  if (c <= 67) return "🌧️";
  if (c <= 77) return "❄️";
  if (c <= 99) return "⛈️";
  return "🌤️";
}

export function timeSince(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return "Recent";
    const m = Math.floor((Date.now() - d) / 60000);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch {
    return "Recent";
  }
}

// ── useNotices ────────────────────────────────────────────────────────────────

export function useNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/notices/all?t=${Date.now()}`,
        { 
          credentials: "include",
          cache: "no-store"
        },
      );
      const json = await res.json();
      setNotices(json.notices || []);
    } catch {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  return { notices, loading, reload: load };
}

// ── useWeather ────────────────────────────────────────────────────────────────

export function useWeather() {
  const [data, setData]     = useState({});
  const [loading, setLoading] = useState(true);
  const [last, setLast]     = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const lats = WEATHER_DISTRICTS.map((d) => d.lat).join(",");
      const lons = WEATHER_DISTRICTS.map((d) => d.lon).join(",");
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`,
      );
      const raw = await res.json();
      const arr = Array.isArray(raw) ? raw : [raw];
      const nd = {};
      WEATHER_DISTRICTS.forEach((d, i) => {
        const c = (arr[i] || arr[0]).current || {};
        nd[d.id] = {
          temp: c.temperature_2m ?? "--",
          code: c.weather_code ?? 0,
          wind: c.wind_speed_10m ?? "--",
          humidity: c.relative_humidity_2m ?? "--",
        };
      });
      setData(nd);
      setLast(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }));
    } catch (e) {
      console.warn("Weather failed", e);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
    const iv = setInterval(load, 900000);
    return () => clearInterval(iv);
  }, [load]);
  return { data, loading, last, reload: load };
}

// ── useRoads ──────────────────────────────────────────────────────────────────

export function useRoads() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [last, setLast]     = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const lats = ROAD_ROUTES.map((r) => r.lat).join(",");
      const lons = ROAD_ROUTES.map((r) => r.lon).join(",");
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,precipitation,wind_speed_10m,visibility&hourly=precipitation_probability&forecast_hours=3&timezone=auto`,
      );
      const raw = await res.json();
      const arr = Array.isArray(raw) ? raw : [raw];
      setData(
        ROAD_ROUTES.map((r, i) => {
          const d = arr[i] || arr[0];
          const c = d.current || {};
          const prec = c.precipitation ?? 0, code = c.weather_code ?? 0,
                wind = c.wind_speed_10m ?? 0, vis = c.visibility ?? 10000;
          const probArr = (d.hourly?.precipitation_probability || []).slice(0, 3);
          const prob = probArr.length
            ? Math.round(probArr.reduce((a, b) => a + b, 0) / probArr.length)
            : 0;
          let status = "clear", issue = "Conditions normal", icon = "✅";
          if (prec > 8 || code >= 95 || wind > 70 || vis < 500) {
            status = "blocked"; issue = `Severe: ${prec}mm rain · ${wind}km/h wind`; icon = "🚧";
          } else if (prec > 2 || (code >= 51 && code <= 82) || wind > 45 || vis < 2000) {
            status = "restricted"; issue = `Caution: ${wxIcon(code)} Rain/Wind warning`; icon = "⚠️";
          }
          return { ...r, status, issue, icon, risk: { prec, code, wind, vis, prob, temp: c.temperature_2m } };
        }),
      );
      setLast(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }));
    } catch (e) {
      console.warn("Roads failed", e);
      setData(ROAD_ROUTES.map((r) => ({ ...r, status: "unknown", issue: "Data unavailable", icon: "❓", risk: null })));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
    const iv = setInterval(load, 600000);
    return () => clearInterval(iv);
  }, [load]);
  return { data, loading, last, reload: load };
}

// ── useAlerts ─────────────────────────────────────────────────────────────────

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]       = useState(false);
  const [last, setLast]     = useState("");

  const lvl = (t) => {
    const l = t.toLowerCase();
    if (/red alert|extreme|very heavy rain|severe flood/.test(l)) return "red";
    if (/orange|heavy rain|landslide|flood warning|warning/.test(l)) return "orange";
    if (/yellow|moderate rain|watch/.test(l)) return "yellow";
    return "blue";
  };
  const LABELS  = { red: "🔴 Red Alert", orange: "🟠 Orange Warning", yellow: "🟡 Yellow Watch", blue: "🔵 Advisory" };
  const ACTIONS = {
    red:    "Halt all travel. Stay indoors immediately.",
    orange: "Exercise caution. Monitor updates closely.",
    yellow: "Be alert. Stay prepared to act.",
    blue:   "Stay informed. Check updates regularly.",
  };
  const DEFAULT_ALERT = {
    id: "def", level: "blue", label: "🔵 Advisory", src: "IMD Gangtok",
    time: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
    title: "No severe warnings currently active for Sikkim",
    desc:  "Conditions are being monitored. Check IMD Gangtok for the latest official forecasts and warnings.",
    action: "Stay informed and check IMD portal regularly.",
  };

  const load = useCallback(async () => {
    setLoading(true); setErr(false);
    try {
      const proxies = [
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://sachet.ndma.gov.in/rss/all")}`,
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://mausam.imd.gov.in/imd_latest/contents/warning_bulletin.php")}`,
      ];
      let items = [];
      for (const url of proxies) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
          const json = await res.json();
          if (json.items?.length > 0) { items = json.items; break; }
        } catch { /* try next proxy */ }
      }
      if (items.length > 0) {
        const parsed = items.slice(0, 5).map((item) => {
          const txt   = (item.title || "") + (item.description || "");
          const clean = txt.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
          const level = lvl(clean);
          return {
            id: Math.random().toString(36).slice(2), level, label: LABELS[level],
            title: (item.title || "").replace(/<[^>]+>/g, "").slice(0, 90),
            desc: clean.slice(0, 300), action: ACTIONS[level], src: "NDMA / IMD",
            time: item.pubDate
              ? new Date(item.pubDate).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
              : new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
          };
        });
        setAlerts(parsed);
      } else {
        // Fallback: scrape IMD Gangtok
        const res2 = await fetch(
          `https://corsproxy.io/?${encodeURIComponent("https://mausam.imd.gov.in/gangtok/")}`,
          { signal: AbortSignal.timeout(8000) },
        );
        const html = await res2.text();
        const doc  = new DOMParser().parseFromString(html, "text/html");
        const parsed = [];
        const skipPhrases = ["forecast city","district forecast","national forecast","tourism forecast","pilgrimage","extended range","value added","tabular","graphical"];
        doc.querySelectorAll("p,marquee,td").forEach((el) => {
          if (el.closest("nav,header,footer,ul,ol")) return;
          const txt   = el.textContent.replace(/\s+/g, " ").trim();
          const lower = txt.toLowerCase();
          if (skipPhrases.some((w) => lower.includes(w))) return;
          if (txt.length > 60 && txt.length < 800 &&
              /(warning|alert|flood|landslide|cyclone|thunder|heavy rain|red|orange|yellow|sikkim|northeast)/i.test(txt)) {
            if (!parsed.find((p) => p.desc.slice(0, 50) === txt.slice(0, 50))) {
              const level = lvl(txt);
              parsed.push({
                id: Math.random().toString(36).slice(2), level, label: LABELS[level],
                title: txt.length > 90 ? txt.slice(0, 90) + "…" : txt,
                desc: txt, action: ACTIONS[level], src: "IMD Gangtok",
                time: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
              });
            }
          }
        });
        setAlerts(parsed.length > 0 ? parsed.slice(0, 5) : [DEFAULT_ALERT]);
      }
    } catch (e) {
      console.warn("Alerts failed", e);
      setErr(true);
      setAlerts([{ ...DEFAULT_ALERT, desc: "Conditions are being monitored. Use the IMD Gangtok button below for direct access to official warnings.", action: "Visit IMD Gangtok portal for updates." }]);
    } finally {
      setLoading(false);
      setLast(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }));
    }
  }, []);
  useEffect(() => {
    load();
    const iv = setInterval(load, 600000);
    return () => clearInterval(iv);
  }, [load]);
  return { alerts, loading, err, last, reload: load };
}

// ── useIncidents ──────────────────────────────────────────────────────────────

export function useIncidents() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [last, setLast]     = useState("");

  const COLORMAP = { landslide:"#dc2626", flood:"#d97706", road:"#ca8a04", snow:"#0369a1", seismic:"#7c3aed", earthquake:"#7c3aed", rescue:"#16a34a", cyclone:"#b91c1c", rain:"#2563eb", highway:"#ca8a04" };
  const BADGEMAP = {
    landslide:  { bg:"#fef2f2", c:"#b91c1c", t:"Active"   },
    flood:      { bg:"#fef3c7", c:"#92400e", t:"Ongoing"  },
    road:       { bg:"#fefce8", c:"#a16207", t:"Notice"   },
    snow:       { bg:"#f0f9ff", c:"#075985", t:"Advisory" },
    seismic:    { bg:"#f5f3ff", c:"#5b21b6", t:"Info"     },
    earthquake: { bg:"#f5f3ff", c:"#5b21b6", t:"Info"     },
    rescue:     { bg:"#f0fdf4", c:"#166534", t:"Update"   },
    cyclone:    { bg:"#fef2f2", c:"#b91c1c", t:"Alert"    },
    rain:       { bg:"#eff6ff", c:"#1d4ed8", t:"Watch"    },
    highway:    { bg:"#fefce8", c:"#a16207", t:"Notice"   },
  };
  const ALL_CLEAR_ITEM = {
    id: "none", title: "No recent Sikkim disaster news in last 7 days",
    date: "Now", timeAgo: "Now", timestamp: Date.now(),
    color: "#16a34a", badge: "All Clear", bbg: "#f0fdf4", bc: "#166534",
    link: "https://news.google.com/search?q=Sikkim+disaster", src: "Google News",
  };

  const parseItems = (entries) => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return entries
      .map((item) => {
        const title   = (item.title || "").replace(/<[^>]+>/g, "").replace(/ - Google News$/, "").trim();
        const link    = item.link || item.guid || item.url || "#";
        const pubDate = item.pubDate || item.published || "";
        const source  = item.author || item.source?.name || item.feed_title || "News";
        const lower   = title.toLowerCase();
        const key     = Object.keys(COLORMAP).find((k) => lower.includes(k)) || "road";
        const badge   = BADGEMAP[key] || { bg:"#f1f5f9", c:"#475569", t:"News" };
        const dateObj = pubDate ? new Date(pubDate) : null;
        return {
          id: Math.random().toString(36).slice(2),
          title: title.length > 90 ? title.slice(0, 90) + "…" : title,
          date: dateObj ? dateObj.toLocaleString("en-IN", { timeZone:"Asia/Kolkata", day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "Recent",
          timeAgo: timeSince(pubDate), timestamp: dateObj ? dateObj.getTime() : 0,
          color: COLORMAP[key] || "#64748b", badge: badge.t, bbg: badge.bg, bc: badge.c, link, src: source,
        };
      })
      .filter((item) => item.timestamp === 0 || item.timestamp > sevenDaysAgo)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const today   = new Date().toISOString().split("T")[0];
    const queries = [
      `Sikkim landslide flood disaster after:${today}`,
      `Sikkim highway road disaster after:${today}`,
      `Sikkim flood rain warning 2026`,
    ];
    let allItems = [];
    for (const query of queries) {
      try {
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=8`;
        const res  = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
        const json = await res.json();
        if (json.items?.length > 0) allItems = [...allItems, ...json.items];
      } catch (e) { console.warn("Query failed:", query, e); }
    }
    const seen   = new Set();
    const unique = allItems.filter((item) => { const k = (item.title||"").slice(0,40); if(seen.has(k))return false; seen.add(k); return true; });
    const parsed = parseItems(unique);
    if (parsed.length > 0) {
      setItems(parsed);
    } else {
      try {
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent("Sikkim disaster news")}&hl=en-IN&gl=IN&ceid=IN:en`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=6`;
        const res  = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
        const json = await res.json();
        const fallback = json.items?.length > 0 ? parseItems(json.items) : [];
        setItems(fallback.length > 0 ? fallback : [ALL_CLEAR_ITEM]);
      } catch { setItems([ALL_CLEAR_ITEM]); }
    }
    setLast(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }));
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
    const iv = setInterval(load, 600000);
    return () => clearInterval(iv);
  }, [load]);
  return { items, loading, last, reload: load };
}
