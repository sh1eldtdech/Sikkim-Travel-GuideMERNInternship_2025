import React, { useState, useCallback } from "react";
import STYLES from "./DisasterStyles";
import {
  WEATHER_DISTRICTS,
  DIR_META,
  ROAD_ROUTES,
  CONTACTS,
  SAFETY_GUIDES,
  OFFICIAL_SOURCES,
  DEPT_LABEL,
  SEV_LABELS,
} from "./DisasterConstants";
import {
  useWeather,
  useRoads,
  useAlerts,
  useIncidents,
  useNotices,
  wxIcon,
} from "./DisasterHooks";
import { Ping, RoadCard, AlertCard } from "./DisasterComponents";

export default function SikkimDisasterAlert() {
  const { data: wx, loading: wxLoad, last: wxLast, reload: wxReload } = useWeather();
  const { data: roads, loading: rLoad, last: rLast, reload: rReload } = useRoads();
  const { alerts, loading: aLoad, err: aErr, last: aLast, reload: aReload } = useAlerts();
  const { items: news, loading: nLoad, last: nLast, reload: nReload } = useIncidents();
  const { notices, loading: nNotLoad, reload: reloadNotices } = useNotices();

  const [showNotices, setShowNotices] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null); // 'image' or 'pdf'

  const handlePreview = useCallback((url, fileType = null) => {
    if (!url) return;

    // Determine file type from provided type or URL
    let type = 'pdf';
    if (fileType) {
      type = fileType.startsWith('image/') ? 'image' : 'pdf';
    } else {
      // Fallback to URL-based detection
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.match(/\.(jpg|jpeg|png|webp|avif|gif|bmp)$/i) || lowerUrl.includes('image')) {
        type = 'image';
      } else if (lowerUrl.includes('pdf')) {
        type = 'pdf';
      }
    }

    if (type === 'image') {
      setPreviewType('image');
      setPreviewUrl(url);
    } else {
      // For PDFs, open in new tab (most reliable approach)
      window.open(url, '_blank');
    }
  }, []);

  const closePreview = useCallback(() => {
    setPreviewUrl(null);
    setPreviewType(null);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="da-wrap">
        <div className="da-hero">
          <div className="da-hero-inner">
            <div>
              <h1 className="da-hero-title">
                Sikkim <em>Disaster</em>
                <br />
                Alert Center
              </h1>
              <p className="da-hero-sub">
                Real-time emergency status, highway conditions &amp; official warnings
              </p>
              <div className="da-hero-badges">
                <span className="da-hero-badge"><Ping t="g" /> Weather Live</span>
                <span className="da-hero-badge"><Ping t="g" /> Highway Live</span>
                <span className="da-hero-badge"><Ping t="r" /> IMD Alerts Live</span>
                <span className="da-hero-badge"><Ping t="g" /> News Live</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem" }}>
              <button
                className="da-notice-btn"
                onClick={() => {
                  setShowNotices(true);
                  reloadNotices();
                }}
              >
                View All Notices {notices.length > 0 && `(${notices.length})`}
              </button>
              <div className="da-hero-stats">
                <div className="da-stat">
                  <div className="da-stat-num">13</div>
                  <div className="da-stat-label">Districts</div>
                </div>
                <div className="da-stat">
                  <div className="da-stat-num">4</div>
                  <div className="da-stat-label">Highways</div>
                </div>
                <div className="da-stat">
                  <div className="da-stat-num" style={{ color: "#86efac" }}>
                    {alerts.length || "—"}
                  </div>
                  <div className="da-stat-label">Live Alerts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="da-main">
          <div className="da-grid">
            {/* LEFT COL */}
            <div className="da-col-l">
              {/* Map */}
              <div className="da-card">
                <div className="da-card-head">
                  <div className="da-card-title"><span className="da-accent" />🧭 Live Interactive Region Map</div>
                  <div className="da-sync"><Ping t="g" /> GPS Active</div>
                </div>
                <div className="da-map">
                  <iframe
                    src="https://maps.google.com/maps?q=Sikkim,India&t=p&z=9&ie=UTF8&iwloc=&output=embed"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sikkim Map"
                  />
                </div>
              </div>

              {/* Highway */}
              <div className="da-card">
                <div className="da-card-head">
                  <div className="da-card-title"><span className="da-accent" />📍 Live Highway Conditions</div>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <div className="da-sync">🔄 {rLast || "Syncing…"}</div>
                    <button onClick={rReload} className={`da-rbtn ${rLoad ? "da-spin" : ""}`}>🔄</button>
                  </div>
                </div>
                <div className="da-card-body">
                  <div className="da-api-note">
                    <span className="da-api-dot" /> Live weather-based road risk at GPS coordinates · Auto-refreshes every 10 min
                  </div>
                  <div className="da-road-grid">
                    {(roads || ROAD_ROUTES.map((r) => ({ ...r, status: "unknown", issue: "Loading…", icon: "⏳", risk: null }))).map((r) => (
                      <RoadCard key={r.id} r={r} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Safety Guide */}
              <div className="da-card">
                <div className="da-card-head">
                  <div className="da-card-title"><span className="da-accent" />📖 Safety Guidelines</div>
                </div>
                <div className="da-card-body">
                  <div className="da-guide-grid">
                    {SAFETY_GUIDES.map((g, i) => (
                      <div key={i} className="da-guide-item">
                        <div className="da-guide-icon" style={{ background: g.bg, border: `1px solid ${g.border}`, color: g.color }}>
                          {g.icon}
                        </div>
                        <div className="da-guide-name">{g.title}</div>
                        <div className="da-guide-text">{g.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COL */}
            <div className="da-col-r">
              {/* Weather */}
              <div className="da-weather">
                <div className="da-weather-head">
                  <div className="da-weather-title">🌡️ Live Regional Weather</div>
                  <button onClick={wxReload} className={`da-wbtn ${wxLoad ? "da-spin" : ""}`}>🔄</button>
                </div>
                <div className="da-weather-groups">
                  {["North", "East", "West", "South"].map((dir) => {
                    const m = DIR_META[dir];
                    return (
                      <div key={dir}>
                        <div className="da-dir-label">
                          <span className="da-dir-bar" style={{ background: m.bar }} />{m.label}
                        </div>
                        <div className="da-wrow">
                          {WEATHER_DISTRICTS.filter((d) => d.dir === dir).map((d) => {
                            const w = wx[d.id];
                            return (
                              <div key={d.id} className="da-witem">
                                <div style={{ minWidth: 0 }}>
                                  <span className="da-wname">{d.name}</span>
                                  <div className="da-wwind">{w ? `💨 ${w.wind}km/h` : "…"}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                                  <span className="da-wtemp">{w ? `${w.temp}°` : "--"}</span>
                                  {w && <span className="da-wicon">{wxIcon(w.code)}</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="da-wfoot">Last updated: {wxLast || "Loading…"} · Refreshes every 15 min</div>
              </div>

              {/* Alerts */}
              <div className="da-card">
                <div className="da-card-head">
                  <div className="da-card-title"><span className="da-accent" /><span className="da-pulse">🚨</span> Live Official Warnings</div>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <div className={`da-sync ${aErr ? "err" : ""}`}>{aErr ? "⚠ Fallback" : `🔴 ${aLast || "Loading…"}`}</div>
                    <button onClick={aReload} className={`da-rbtn ${aLoad ? "da-spin" : ""}`}>🔄</button>
                  </div>
                </div>
                <div className="da-card-body">
                  {aLoad ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div className="da-alert-skel" />
                      <div className="da-alert-skel" style={{ height: 70 }} />
                    </div>
                  ) : (
                    <div className="da-alerts">
                      {alerts.map((a) => <AlertCard key={a.id} a={a} />)}
                    </div>
                  )}
                </div>
              </div>

              {/* IMD Links */}
              <div className="da-card">
                <div className="da-imd-head">
                  <div className="da-imd-icon">🌦️</div>
                  <div>
                    <div className="da-imd-htitle">India Meteorological Department</div>
                    <div className="da-imd-hsub">Sikkim &amp; NE India · Official Source</div>
                  </div>
                </div>
                <div className="da-imd-body">
                  <p className="da-imd-desc">Access official forecasts, warnings and bulletins from IMD for Sikkim and North East India.</p>
                  <div className="da-imd-grid">
                    <a href="https://mausam.imd.gov.in/gangtok/" target="_blank" rel="noopener noreferrer" className="da-imd-link p">
                      🌐 Open IMD Gangtok (Sikkim) <span className="da-imd-link-arrow">↗</span>
                    </a>
                    <a href="https://mausam.imd.gov.in/gangtok/" target="_blank" rel="noopener noreferrer" className="da-imd-link s">
                      📋 District Forecasts <span className="da-imd-link-arrow">↗</span>
                    </a>
                    <a href="https://rsmcnewdelhi.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="da-imd-link s">
                      🗺️ NE India Forecast <span className="da-imd-link-arrow">↗</span>
                    </a>
                    <a href="https://sachet.ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="da-imd-link s">
                      🚨 NDMA Sachet <span className="da-imd-link-arrow">↗</span>
                    </a>
                  </div>
                  <div className="da-imd-foot"><Ping t="g" /> Official government portal · Updates every 3-6 hours</div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM: Emergency Contacts + Live News */}
          <div className="da-bottom-grid">
            {/* Contacts */}
            <div className="da-card">
              <div className="da-card-head">
                <div className="da-card-title"><span className="da-accent" />📞 Emergency Contacts</div>
                <div className="da-sync" style={{ background: "#fef2f2", color: "#b91c1c", borderColor: "#fecaca" }}>● Available 24x7</div>
              </div>
              <div className="da-card-body">
                <div className="da-contacts">
                  {CONTACTS.map((c, i) => (
                    <div key={i} className="da-contact">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                        <div className="da-contact-icon">{c.icon}</div>
                        <div>
                          <div className="da-contact-label">{c.label}</div>
                          <div className="da-contact-num">{c.number}</div>
                          <div className="da-contact-sub">{c.sub}</div>
                        </div>
                      </div>
                      <a href={`tel:${c.number}`} className="da-call">📞 Call</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* News */}
            <div className="da-card">
              <div className="da-card-head">
                <div className="da-card-title"><span className="da-accent" />📰 Live Incident &amp; News Feed</div>
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <div className="da-sync" style={{ background: "#f5f3ff", color: "#6d28d9", borderColor: "#ddd6fe" }}>
                    <Ping t="r" /> Live · {nLast || "Loading…"}
                  </div>
                  <button onClick={nReload} className={`da-rbtn ${nLoad ? "da-spin" : ""}`}>🔄</button>
                </div>
              </div>
              <div className="da-card-body">
                {nLoad ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[1, 2, 3].map((i) => <div key={i} className="da-shimmer" style={{ height: 60, borderRadius: "0.5rem" }} />)}
                  </div>
                ) : news.length === 1 && news[0].badge === "All Clear" ? (
                  <div>
                    <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✅</div>
                      <div style={{ fontWeight: 800, fontSize: "1rem", color: "#15803d", marginBottom: "0.25rem" }}>No Active Incidents</div>
                      <div style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 500 }}>No disaster or road incidents reported in Sikkim in the last 7 days</div>
                      <div style={{ fontSize: "0.7rem", color: "#4ade80", marginTop: "0.5rem", fontWeight: 600 }}>Last checked: {nLast || "--"}</div>
                    </div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--slate-mid)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>🔗 Monitor Official Sources</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {OFFICIAL_SOURCES.map((l, i) => (
                        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "#fff", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, color: "var(--slate)", transition: "box-shadow 0.15s" }}>
                          <span style={{ fontSize: "1rem" }}>{l.icon}</span>
                          <span style={{ flex: 1 }}>{l.label}</span>
                          <span style={{ color: "var(--slate-lt)", fontSize: "0.75rem" }}>↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="da-timeline">
                    {news.map((item) => (
                      <div key={item.id} className="da-tl-item">
                        <div className="da-tl-spine">
                          <div className="da-tl-dot" style={{ color: item.color, background: item.color }} />
                          <div className="da-tl-line" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="da-tl-date">{item.date} · <span style={{ color: "#94a3b8" }}>{item.timeAgo}</span></div>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <div className="da-tl-title" style={{ color: "var(--slate)", cursor: "pointer" }}>{item.title}</div>
                          </a>
                          <div className="da-tl-src">📡 {item.src}</div>
                          <span className="da-tl-badge" style={{ background: item.bbg, color: item.bc }}>● {item.badge}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notices Panel */}
      {showNotices && (
        <div className="da-panel-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowNotices(false); }}>
          <div className="da-panel">
            <div className="da-panel-head">
              <div className="da-panel-title">Official Government Notices</div>
              <button className="da-panel-close" onClick={() => setShowNotices(false)}>✕</button>
            </div>
            {nNotLoad ? (
              <div className="da-notice-empty">Loading notices...</div>
            ) : notices.length === 0 ? (
              <div className="da-notice-empty">
                <p style={{ fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }}>No Active Notices</p>
                <p style={{ fontSize: "0.8rem" }}>No government notices have been issued at this time.</p>
              </div>
            ) : (
              <div style={{ overflowY: "auto", flex: 1 }}>
                {notices.map((n) => (
                  <div key={n._id} className="da-notice-card">
                    <div className="da-notice-dept">
                      <span>{DEPT_LABEL[n.department] || n.department}</span>
                      <span className="da-notice-date">{new Date(n.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="da-notice-title">{n.title}</div>
                    {n.affectedAreas && <div className="da-notice-area">{n.affectedAreas}</div>}
                    <div className="da-notice-body">{n.content}</div>
                    {n.attachmentUrl && (
                      <div style={{ marginTop: "12px" }}>
                        <button
                          onClick={() => handlePreview(n.attachmentUrl, n.attachmentType)}
                          style={{
                            border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px",
                            backgroundColor: "#e2e8f0", color: "#1e293b", fontSize: "0.8rem", fontWeight: 600,
                            padding: "6px 12px", borderRadius: "6px", textDecoration: "none", transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#cbd5e1")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
                        >
                          <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {n.attachmentType?.startsWith('image/') ? 'View Image' : 'Open PDF'}
                        </button>
                      </div>
                    )}
                    <div className="da-notice-meta">
                      <span className="da-notice-cat">{n.category}</span>
                      <span className="da-notice-sev">{SEV_LABELS[n.severity] || n.severity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attachment Preview Modal (Images only) */}
      {previewUrl && previewType === 'image' && (
        <div
          className="da-panel-overlay"
          style={{ zIndex: 2000, justifyContent: "center", alignItems: "center", padding: "1rem" }}
          onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}
        >
          <div style={{ backgroundColor: "#fff", borderRadius: "8px", width: "100%", maxWidth: "800px", height: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <div style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
                Image Preview
              </h3>
              <button onClick={closePreview} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <div style={{ flex: 1, backgroundColor: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
              <img src={previewUrl} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} alt="Notice Attachment" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
