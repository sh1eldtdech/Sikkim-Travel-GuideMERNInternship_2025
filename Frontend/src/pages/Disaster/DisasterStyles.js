// All scoped styles for the Disaster Alert page
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --green:#1a5c38; --green-mid:#2d7a50; --green-lt:#e8f5ee; --green-xlt:#f3faf6;
  --slate:#1e293b; --slate-mid:#475569; --slate-lt:#94a3b8;
  --border:#e2e8f0; --bg:#f8fafc; --white:#ffffff;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.08); --shadow-md:0 4px 16px rgba(0,0,0,0.1);
  --radius:0.875rem; --radius-sm:0.5rem;
}
.da-wrap { width:100%; font-family:'DM Sans',system-ui,sans-serif; color:var(--slate); background:var(--bg); }
.da-hero { background:linear-gradient(120deg,#1a5c38 0%,#2d7a50 60%,#1a5c38 100%); width:100%; padding:0 1.5rem 3rem; position:relative; overflow:hidden; }
.da-hero::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:36px; background:var(--bg); clip-path:ellipse(55% 100% at 50% 100%); }
.da-hero-inner { max-width:88rem; margin:0 auto; display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:1.5rem; position:relative; z-index:2; padding-top:8rem; }
.da-hero-title { font-family:'Fraunces',Georgia,serif; font-size:clamp(2rem,5vw,3rem); font-weight:900; color:#fff; line-height:1.1; letter-spacing:-0.02em; }
.da-hero-title em { font-style:italic; color:#86efac; }
.da-hero-sub { color:rgba(255,255,255,0.7); font-size:1rem; margin-top:0.5rem; font-weight:500; }
.da-hero-badges { display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:1rem; }
.da-hero-badge { display:flex; align-items:center; gap:0.35rem; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); padding:0.35rem 0.875rem; border-radius:9999px; font-size:0.75rem; font-weight:700; color:rgba(255,255,255,0.9); }
.da-hero-stats { display:flex; gap:1rem; flex-wrap:wrap; }
.da-stat { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:var(--radius-sm); padding:0.75rem 1.25rem; text-align:center; min-width:85px; }
.da-stat-num { font-family:'Fraunces',serif; font-size:1.75rem; font-weight:900; color:#fff; line-height:1; }
.da-stat-label { font-size:0.6rem; color:rgba(255,255,255,0.6); font-weight:700; text-transform:uppercase; letter-spacing:0.07em; margin-top:0.2rem; }
.da-main { max-width:88rem; margin:0 auto; padding:1.5rem 1.5rem 3rem; }
.da-grid { display:grid; grid-template-columns:1fr; gap:1.5rem; align-items:start; }
@media(min-width:1024px) { .da-grid { grid-template-columns:repeat(3,1fr); } .da-col-l { grid-column:span 2; } }
.da-col-l { display:flex; flex-direction:column; gap:5rem; align-self:start; }
.da-col-r { display:flex; flex-direction:column; gap:1.5rem; align-self:start; }
.da-bottom-grid { display:grid; grid-template-columns:1fr; gap:1.5rem; margin-top:3rem; align-items:start; }
@media(min-width:768px) { .da-bottom-grid { grid-template-columns:1fr 1fr; } }
.da-card { background:var(--white); border-radius:var(--radius); border:1px solid var(--border); box-shadow:var(--shadow-sm); overflow:hidden; }
.da-card-head { padding:0.875rem 1.25rem; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; }
.da-card-title { font-size:0.875rem; font-weight:800; color:var(--slate); display:flex; align-items:center; gap:0.5rem; }
.da-accent { display:inline-block; width:3px; height:14px; background:var(--green); border-radius:9999px; flex-shrink:0; }
.da-card-body { padding:1.25rem; }
.da-map { position:relative; height:360px; background:var(--green-xlt); }
@media(min-width:1024px) { .da-map { height:400px; } }
.da-map iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
.da-road-grid { display:grid; grid-template-columns:1fr; gap:0.75rem; }
@media(min-width:580px) { .da-road-grid { grid-template-columns:repeat(2,1fr); } }
.da-road-card { border:1px solid var(--border); border-radius:var(--radius-sm); padding:0.875rem 1rem; display:flex; flex-direction:column; gap:0.4rem; transition:box-shadow 0.2s,transform 0.2s; }
.da-road-card:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
.da-road-top { display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; }
.da-road-name { font-weight:800; color:var(--slate); font-size:0.82rem; line-height:1.3; flex:1; }
.da-road-meta { font-size:0.7rem; color:var(--slate-lt); display:flex; gap:0.5rem; flex-wrap:wrap; }
.da-road-risk { border-radius:0.4rem; padding:0.4rem 0.65rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.3rem; }
.da-road-issue { font-size:0.72rem; font-weight:600; display:flex; align-items:center; gap:0.3rem; }
.da-badge { display:inline-flex; align-items:center; padding:0.2rem 0.6rem; border-radius:9999px; font-size:0.68rem; font-weight:800; border:1.5px solid; white-space:nowrap; }
.da-badge-blocked { background:#fef2f2; color:#b91c1c; border-color:#fecaca; }
.da-badge-restricted { background:#fff7ed; color:#c2410c; border-color:#fed7aa; }
.da-badge-clear { background:var(--green-lt); color:var(--green); border-color:#86efac; }
.da-badge-unknown { background:#f8fafc; color:#64748b; border-color:#e2e8f0; }
.da-api-note { display:flex; align-items:center; gap:0.5rem; background:var(--green-xlt); border:1px solid #bbf7d0; border-radius:var(--radius-sm); padding:0.45rem 0.875rem; margin-bottom:1rem; font-size:0.72rem; font-weight:600; color:var(--green); }
.da-api-dot { width:6px; height:6px; border-radius:50%; background:var(--green); flex-shrink:0; animation:blink 1.5s ease-in-out infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.da-shimmer { background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:0.4rem; height:11px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.da-weather { background:linear-gradient(135deg,#1a5c38 0%,#1e6b41 100%); border-radius:var(--radius); padding:1.25rem; color:#fff; box-shadow:0 4px 20px rgba(26,92,56,0.25); }
.da-weather-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
.da-weather-title { font-family:'Fraunces',serif; font-size:1rem; font-weight:700; color:#fff; display:flex; align-items:center; gap:0.5rem; }
.da-wbtn { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); padding:0.38rem; border-radius:9999px; cursor:pointer; font-size:12px; color:#fff; display:flex; align-items:center; transition:background 0.2s; }
.da-wbtn:hover { background:rgba(255,255,255,0.2); }
.da-weather-groups { display:flex; flex-direction:column; gap:0.875rem; }
.da-dir-label { font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.09em; color:rgba(255,255,255,0.5); display:flex; align-items:center; gap:0.4rem; margin-bottom:0.3rem; }
.da-dir-bar { display:inline-block; width:16px; height:2px; border-radius:9999px; }
.da-wrow { display:grid; grid-template-columns:1fr 1fr; gap:0.4rem; }
.da-witem { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1); border-radius:0.5rem; padding:0.55rem 0.7rem; display:flex; justify-content:space-between; align-items:center; transition:background 0.2s; }
.da-witem:hover { background:rgba(255,255,255,0.13); }
.da-wname { font-weight:700; font-size:0.75rem; color:rgba(255,255,255,0.95); display:block; }
.da-wwind { font-size:0.62rem; color:rgba(255,255,255,0.4); margin-top:0.1rem; }
.da-wtemp { font-family:'Fraunces',serif; font-size:1.1rem; font-weight:700; color:#fff; }
.da-wicon { font-size:15px; }
.da-wfoot { margin-top:0.875rem; font-size:0.65rem; color:rgba(255,255,255,0.35); text-align:center; }
.da-alerts { display:flex; flex-direction:column; gap:0.75rem; }
.da-alert { border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--border); }
.da-alert-stripe { height:4px; }
.da-alert-stripe.red { background:linear-gradient(90deg,#dc2626,#ef4444); }
.da-alert-stripe.orange { background:linear-gradient(90deg,#d97706,#f59e0b); }
.da-alert-stripe.yellow { background:linear-gradient(90deg,#ca8a04,#eab308); }
.da-alert-stripe.blue { background:linear-gradient(90deg,#1d4ed8,#3b82f6); }
.da-alert-inner { padding:0.875rem 1rem; background:#fff; }
.da-alert-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem; flex-wrap:wrap; gap:0.3rem; }
.da-alert-level { font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; display:flex; align-items:center; gap:0.35rem; }
.da-alert-time { font-size:0.65rem; color:var(--slate-lt); font-weight:600; }
.da-alert-title { font-weight:800; font-size:0.85rem; color:var(--slate); margin-bottom:0.25rem; line-height:1.35; }
.da-alert-desc { font-size:0.775rem; color:var(--slate-mid); line-height:1.55; margin-bottom:0.5rem; }
.da-alert-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem; }
.da-alert-action { display:flex; align-items:center; gap:0.3rem; font-size:0.72rem; font-weight:700; padding:0.28rem 0.65rem; border-radius:var(--radius-sm); border:1px solid; }
.da-alert-src { font-size:0.65rem; color:var(--slate-lt); font-weight:600; }
.da-alert-skel { height:90px; border-radius:var(--radius-sm); background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }
.da-alert-empty { text-align:center; padding:2rem 1rem; }
.da-imd-head { background:linear-gradient(90deg,var(--green-xlt),#fff); border-bottom:1px solid var(--border); padding:1rem 1.25rem; display:flex; align-items:center; gap:0.75rem; }
.da-imd-icon { width:38px; height:38px; border-radius:0.55rem; background:var(--green); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.da-imd-htitle { font-weight:800; font-size:0.875rem; color:var(--slate); }
.da-imd-hsub { font-size:0.68rem; color:var(--green); font-weight:700; text-transform:uppercase; letter-spacing:0.04em; margin-top:0.1rem; }
.da-imd-body { padding:1rem 1.25rem; }
.da-imd-desc { font-size:0.8rem; color:var(--slate-mid); line-height:1.55; margin-bottom:1rem; }
.da-imd-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
.da-imd-link { display:flex; align-items:center; gap:0.5rem; padding:0.6rem 0.875rem; border-radius:var(--radius-sm); text-decoration:none; font-size:0.75rem; font-weight:700; transition:all 0.18s; border:1.5px solid; }
.da-imd-link.p { background:var(--green); color:#fff; border-color:var(--green); grid-column:span 2; }
.da-imd-link.p:hover { background:#2d7a50; }
.da-imd-link.s { background:var(--green-xlt); color:var(--green); border-color:#bbf7d0; }
.da-imd-link.s:hover { background:var(--green-lt); }
.da-imd-link-arrow { margin-left:auto; opacity:0.6; font-size:0.8rem; }
.da-imd-foot { margin-top:0.875rem; padding-top:0.875rem; border-top:1px solid var(--border); display:flex; align-items:center; gap:0.5rem; font-size:0.68rem; color:var(--green); font-weight:700; }
.da-guide-grid { display:grid; grid-template-columns:1fr; gap:0.75rem; }
@media(min-width:580px) { .da-guide-grid { grid-template-columns:repeat(3,1fr); } }
.da-guide-item { border:1px solid var(--border); border-radius:var(--radius-sm); padding:0.875rem; transition:box-shadow 0.2s,transform 0.2s; }
.da-guide-item:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); }
.da-guide-icon { width:34px; height:34px; border-radius:0.5rem; display:flex; align-items:center; justify-content:center; margin-bottom:0.6rem; font-size:16px; }
.da-guide-name { font-weight:800; color:var(--slate); font-size:0.82rem; margin-bottom:0.25rem; }
.da-guide-text { color:var(--slate-mid); font-size:0.75rem; line-height:1.5; }
.da-timeline { display:flex; flex-direction:column; }
.da-tl-item { display:flex; gap:0.75rem; padding:0.65rem 0; border-bottom:1px solid #f1f5f9; }
.da-tl-item:first-child { padding-top:0; }
.da-tl-item:last-child { border-bottom:none; padding-bottom:0; }
.da-tl-spine { display:flex; flex-direction:column; align-items:center; flex-shrink:0; padding-top:3px; }
.da-tl-dot { width:10px; height:10px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 0 2px currentColor; flex-shrink:0; }
.da-tl-line { width:1.5px; background:var(--border); flex:1; min-height:12px; margin-top:4px; }
.da-tl-item:last-child .da-tl-line { display:none; }
.da-tl-date { font-size:0.63rem; font-weight:700; color:var(--slate-lt); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.1rem; }
.da-tl-title { font-size:0.82rem; font-weight:800; color:var(--slate); margin-bottom:0.08rem; }
.da-tl-desc { font-size:0.73rem; color:var(--slate-mid); line-height:1.4; }
.da-tl-badge { display:inline-flex; align-items:center; gap:0.2rem; padding:0.12rem 0.5rem; border-radius:9999px; font-size:0.62rem; font-weight:800; margin-top:0.25rem; text-transform:uppercase; }
.da-tl-src { font-size:0.6rem; color:var(--slate-lt); margin-top:0.15rem; }
.da-contacts { display:flex; flex-direction:column; gap:0.3rem; }
.da-contact { display:flex; justify-content:space-between; align-items:center; padding:0.4rem 0.7rem; border-radius:var(--radius-sm); border:1px solid var(--border); background:#fff; gap:0.4rem; transition:box-shadow 0.15s; }
.da-contact:hover { box-shadow:var(--shadow-sm); }
.da-contact-icon { width:26px; height:26px; border-radius:50%; background:var(--green-lt); color:var(--green); display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; }
.da-contact-label { font-size:0.58rem; color:var(--slate-lt); font-weight:800; text-transform:uppercase; letter-spacing:0.04em; }
.da-contact-num { font-size:0.8rem; font-weight:800; color:var(--slate); margin-top:0.03rem; }
.da-contact-sub { font-size:0.6rem; color:var(--slate-lt); }
.da-call { background:var(--green); color:#fff; border:none; padding:0.22rem 0.55rem; border-radius:9999px; font-size:0.65rem; font-weight:700; cursor:pointer; text-decoration:none; white-space:nowrap; flex-shrink:0; transition:background 0.15s; display:flex; align-items:center; gap:0.2rem; }
.da-call:hover { background:#2d7a50; }
.da-sync { display:flex; align-items:center; gap:0.3rem; font-size:0.68rem; font-weight:600; color:var(--slate-mid); background:var(--bg); border:1px solid var(--border); padding:0.22rem 0.6rem; border-radius:9999px; white-space:nowrap; }
.da-sync.err { background:#fef2f2; color:#b91c1c; border-color:#fecaca; }
.da-rbtn { background:var(--bg); border:1px solid var(--border); padding:0.32rem; border-radius:9999px; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--slate-mid); font-size:12px; transition:all 0.15s; }
.da-rbtn:hover { background:var(--green-lt); color:var(--green); }
.da-spin { animation:spin 0.9s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.da-pulse { animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
.da-ping { position:relative; display:inline-flex; height:8px; width:8px; flex-shrink:0; }
.da-ping-r { position:absolute; inset:0; border-radius:50%; opacity:0.6; animation:pingA 1.5s cubic-bezier(0,0,0.2,1) infinite; }
.da-ping-c { position:absolute; inset:1.5px; border-radius:50%; }
.da-ping.g .da-ping-r{background:#4ade80;} .da-ping.g .da-ping-c{background:#16a34a;}
.da-ping.r .da-ping-r{background:#f87171;} .da-ping.r .da-ping-c{background:#dc2626;}
.da-ping.a .da-ping-r{background:#fbbf24;} .da-ping.a .da-ping-c{background:#d97706;}
@keyframes pingA { 75%,100%{transform:scale(2.2);opacity:0} }
::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:9999px;}
.da-notice-btn{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.4);color:#fff;font-weight:800;font-size:0.8rem;padding:0.5rem 1.1rem;border-radius:9999px;cursor:pointer;transition:all 0.2s;backdrop-filter:blur(8px);text-decoration:none;}
.da-notice-btn:hover{background:rgba(255,255,255,0.28);transform:translateY(-1px);}
.da-panel-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1000;display:flex;justify-content:flex-end;}
.da-panel{width:min(480px,96vw);height:100%;background:#fff;overflow-y:auto;display:flex;flex-direction:column;box-shadow:-8px 0 40px rgba(0,0,0,0.15);animation:slideIn 0.25s ease-out;}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
.da-panel-head{background:linear-gradient(135deg,#1a5c38,#2d7a50);padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:2;}
.da-panel-title{color:#fff;font-size:1rem;font-weight:800;display:flex;align-items:center;gap:0.5rem;}
.da-panel-close{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;transition:background 0.2s;}
.da-panel-close:hover{background:rgba(255,255,255,0.28);}
.da-notice-card{padding:1.1rem 1.25rem;border-bottom:1px solid #f1f5f9;}
.da-notice-card:last-child{border-bottom:none;}
.da-notice-dept{font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#1a5c38;margin-bottom:0.2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.3rem;}
.da-notice-date{font-size:0.65rem;font-weight:600;color:#94a3b8;}
.da-notice-title{font-weight:800;font-size:0.9rem;color:#1e293b;margin-bottom:0.3rem;}
.da-notice-body{font-size:0.8rem;color:#475569;line-height:1.55;margin-bottom:0.5rem;}
.da-notice-meta{display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;}
.da-notice-cat{display:inline-flex;align-items:center;gap:0.25rem;background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;border-radius:9999px;font-size:0.65rem;font-weight:800;padding:0.18rem 0.55rem;}
.da-notice-sev{display:inline-flex;align-items:center;background:#fef3c7;color:#92400e;border:1px solid #fde68a;border-radius:9999px;font-size:0.65rem;font-weight:800;padding:0.18rem 0.55rem;}
.da-notice-area{font-size:0.68rem;color:#64748b;display:flex;align-items:center;gap:0.25rem;}
.da-notice-empty{padding:3rem 1.5rem;text-align:center;color:#94a3b8;}
`;

export default STYLES;
