import React from "react";
import { wxIcon } from "./DisasterHooks";

// ── Ping indicator ────────────────────────────────────────────────────────────
export function Ping({ t = "g" }) {
  return (
    <span className={`da-ping ${t}`}>
      <span className="da-ping-r" />
      <span className="da-ping-c" />
    </span>
  );
}

// ── RoadCard ──────────────────────────────────────────────────────────────────
export function RoadCard({ r }) {
  const statusStyle = {
    blocked:    { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca", label: "🔴 Blocked"    },
    restricted: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", label: "🟠 Restricted" },
    clear:      { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", label: "🟢 Clear"      },
    unknown:    { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0", label: "⚪ Unknown"    },
  };
  const riskStyle = {
    high:     { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca", label: "High Risk"    },
    moderate: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", label: "Moderate Risk" },
    low:      { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", label: "Low Risk"     },
    unknown:  { bg: "#f8fafc", text: "#64748b", border: "#e2e8f0", label: "No data"      },
  };
  const ss = statusStyle[r.status] || statusStyle.unknown;
  const rLevel = r.risk
    ? r.risk.prec > 5 || r.risk.code >= 95 || r.risk.wind > 60 ? "high"
      : r.risk.prec > 1 || (r.risk.code >= 51 && r.risk.code <= 82) || r.risk.wind > 40 ? "moderate"
      : "low"
    : "unknown";
  const rs = riskStyle[rLevel];

  return (
    <div className="da-road-card">
      <div className="da-road-top">
        <div className="da-road-name">{r.name}</div>
        <span className={`da-badge da-badge-${r.status}`}>{ss.label}</span>
      </div>
      <div className="da-road-meta">
        <span>📍 {r.from} → {r.to}</span>
        <span>📏 {r.km}</span>
      </div>
      {r.risk ? (
        <div className="da-road-risk" style={{ background: rs.bg, border: `1px solid ${rs.border}` }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.7rem", color: rs.text }}>{rs.label}</div>
            <div style={{ fontSize: "0.65rem", color: "#64748b", marginTop: "0.06rem" }}>
              {wxIcon(r.risk.code)} · 💧{r.risk.prec}mm · 💨{r.risk.wind}km/h
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, fontSize: "0.72rem", color: "#475569" }}>
              {r.risk.temp !== undefined ? `${r.risk.temp}°C` : "--"}
            </div>
            <div style={{ fontSize: "0.62rem", color: "#94a3b8" }}>Rain {r.risk.prob}% (3h)</div>
          </div>
        </div>
      ) : (
        <div className="da-shimmer" />
      )}
      <div className="da-road-issue">
        <span>{r.icon}</span>
        <span style={{
          color: r.status === "blocked" ? "#b91c1c" : r.status === "restricted" ? "#c2410c" : "#15803d",
          fontWeight: 600,
        }}>
          {r.issue}
        </span>
      </div>
    </div>
  );
}

// ── AlertCard ─────────────────────────────────────────────────────────────────
export function AlertCard({ a }) {
  const cm = {
    red:    { stripe: "red",    lc: "#b91c1c", abg: "#fef2f2", ac: "#b91c1c", ab: "#fecaca" },
    orange: { stripe: "orange", lc: "#c2410c", abg: "#fff7ed", ac: "#c2410c", ab: "#fed7aa" },
    yellow: { stripe: "yellow", lc: "#92400e", abg: "#fefce8", ac: "#854d0e", ab: "#fde047" },
    blue:   { stripe: "blue",   lc: "#1d4ed8", abg: "#eff6ff", ac: "#1d4ed8", ab: "#bfdbfe" },
  };
  const c = cm[a.level] || cm.blue;
  return (
    <div className="da-alert">
      <div className={`da-alert-stripe ${c.stripe}`} />
      <div className="da-alert-inner">
        <div className="da-alert-meta">
          <div className="da-alert-level" style={{ color: c.lc }}>
            <Ping t={a.level === "red" ? "r" : a.level === "orange" ? "a" : "g"} />
            {a.label}
          </div>
          <span className="da-alert-time">{a.time}</span>
        </div>
        <div className="da-alert-title">{a.title}</div>
        <div className="da-alert-desc">
          {a.desc.length > 200 ? a.desc.slice(0, 200) + "…" : a.desc}
        </div>
        <div className="da-alert-footer">
          <div className="da-alert-action" style={{ background: c.abg, color: c.ac, borderColor: c.ab }}>
            ⚠️ {a.action}
          </div>
          <div className="da-alert-src">📡 {a.src}</div>
        </div>
      </div>
    </div>
  );
}
