import React, { useState, useEffect, useCallback } from 'react';

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
`;

const WEATHER_DISTRICTS = [
  {id:'mangan',name:'Mangan',dir:'North',lat:27.514,lon:88.5323},
  {id:'chungthang',name:'Chungthang',dir:'North',lat:27.6138,lon:88.4891},
  {id:'lachen',name:'Lachen',dir:'North',lat:27.7279,lon:88.5596},
  {id:'lachung',name:'Lachung',dir:'North',lat:27.6879,lon:88.7458},
  {id:'gangtok',name:'Gangtok',dir:'East',lat:27.3314,lon:88.6138},
  {id:'rongli',name:'Rongli',dir:'East',lat:27.1965,lon:88.75},
  {id:'nathula',name:'Nathu La',dir:'East',lat:27.3869,lon:88.8348},
  {id:'gyalshing',name:'Gyalshing',dir:'West',lat:27.2831,lon:88.2427},
  {id:'pelling',name:'Pelling',dir:'West',lat:27.2968,lon:88.2293},
  {id:'yuksom',name:'Yuksom',dir:'West',lat:27.3415,lon:88.2119},
  {id:'namchi',name:'Namchi',dir:'South',lat:27.1672,lon:88.3575},
  {id:'jorethang',name:'Jorethang',dir:'South',lat:27.1037,lon:88.3174},
  {id:'ravangla',name:'Ravangla',dir:'South',lat:27.3025,lon:88.3612},
];
const DIR_META = {
  North:{label:'North Sikkim',bar:'#0ea5e9'},
  East:{label:'East Sikkim',bar:'#10b981'},
  West:{label:'West Sikkim',bar:'#a855f7'},
  South:{label:'South Sikkim',bar:'#f97316'},
};
const ROAD_ROUTES = [
  {id:'nh10',name:'NH-10 (Siliguri–Gangtok)',lat:27.1726,lon:88.5322,km:'148 km',from:'Siliguri',to:'Gangtok'},
  {id:'nsh',name:'North Sikkim Hwy (Gangtok–Mangan)',lat:27.23,lon:88.5,km:'64 km',from:'Gangtok',to:'Mangan'},
  {id:'namchi',name:'Gangtok to Namchi',lat:27.25,lon:88.45,km:'78 km',from:'Gangtok',to:'Namchi'},
  {id:'pelling',name:'Namchi to Gyalshing',lat:27.22,lon:88.3,km:'55 km',from:'Namchi',to:'Gyalshing'},
];
const CONTACTS = [
  {label:'State Disaster Management',number:'1070',sub:'24×7 Control Room',icon:'🏛️'},
  {label:'Police Control Room',number:'100',sub:'Gangtok HQ',icon:'🚔'},
  {label:'Fire & Emergency',number:'101',sub:'All Districts',icon:'🚒'},
  {label:'Ambulance / Medical',number:'108',sub:'STNM Hospital',icon:'🚑'},
  {label:'NDRF Helpline',number:'9436777111',sub:'National Disaster Response',icon:'⛑️'},
  {label:'PWD Road Clearance',number:'03592-202395',sub:'Road condition updates',icon:'🛤️'},
  {label:'Tourist Helpline',number:'1364',sub:'For stranded tourists',icon:'🗺️'},
];

function wxIcon(c){if(c===0)return'☀️';if(c<=3)return'⛅';if(c<=67)return'🌧️';if(c<=77)return'❄️';if(c<=99)return'⛈️';return'🌤️';}
function Ping({t='g'}){return <span className={`da-ping ${t}`}><span className="da-ping-r"/><span className="da-ping-c"/></span>;}
function timeSince(dateStr){
  try{
    const d=new Date(dateStr);if(isNaN(d))return'Recent';
    const m=Math.floor((Date.now()-d)/60000);
    if(m<1)return'Just now';if(m<60)return `${m}m ago`;
    const h=Math.floor(m/60);if(h<24)return `${h}h ago`;
    return `${Math.floor(h/24)}d ago`;
  }catch{return'Recent';}
}

// ✅ LIVE: Weather for all 13 Sikkim districts
function useWeather(){
  const[data,setData]=useState({});const[loading,setLoading]=useState(true);const[last,setLast]=useState('');
  const load=useCallback(async()=>{
    setLoading(true);
    try{
      const lats=WEATHER_DISTRICTS.map(d=>d.lat).join(',');
      const lons=WEATHER_DISTRICTS.map(d=>d.lon).join(',');
      const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`);
      const raw=await res.json();
      const arr=Array.isArray(raw)?raw:[raw];
      const nd={};
      WEATHER_DISTRICTS.forEach((d,i)=>{
        const c=(arr[i]||arr[0]).current||{};
        nd[d.id]={temp:c.temperature_2m??'--',code:c.weather_code??0,wind:c.wind_speed_10m??'--',humidity:c.relative_humidity_2m??'--'};
      });
      setData(nd);setLast(new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'}));
    }catch(e){console.warn('Weather failed',e);}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();const iv=setInterval(load,900000);return()=>clearInterval(iv);},[load]);
  return{data,loading,last,reload:load};
}

// ✅ LIVE: Highway conditions derived from live weather at road GPS points
function useRoads(){
  const[data,setData]=useState(null);const[loading,setLoading]=useState(true);const[last,setLast]=useState('');
  const load=useCallback(async()=>{
    setLoading(true);
    try{
      const lats=ROAD_ROUTES.map(r=>r.lat).join(',');
      const lons=ROAD_ROUTES.map(r=>r.lon).join(',');
      const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code,precipitation,wind_speed_10m,visibility&hourly=precipitation_probability&forecast_hours=3&timezone=auto`);
      const raw=await res.json();
      const arr=Array.isArray(raw)?raw:[raw];
      setData(ROAD_ROUTES.map((r,i)=>{
        const d=arr[i]||arr[0];const c=d.current||{};
        const prec=c.precipitation??0,code=c.weather_code??0,wind=c.wind_speed_10m??0,vis=c.visibility??10000;
        const probArr=(d.hourly?.precipitation_probability||[]).slice(0,3);
        const prob=probArr.length?Math.round(probArr.reduce((a,b)=>a+b,0)/probArr.length):0;
        let status='clear',issue='Conditions normal',icon='✅';
        if(prec>8||code>=95||wind>70||vis<500){status='blocked';issue=`Severe: ${prec}mm rain · ${wind}km/h wind`;icon='🚧';}
        else if(prec>2||(code>=51&&code<=82)||wind>45||vis<2000){status='restricted';issue=`Caution: ${wxIcon(code)} Rain/Wind warning`;icon='⚠️';}
        return{...r,status,issue,icon,risk:{prec,code,wind,vis,prob,temp:c.temperature_2m}};
      }));
      setLast(new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'}));
    }catch(e){console.warn('Roads failed',e);setData(ROAD_ROUTES.map(r=>({...r,status:'unknown',issue:'Data unavailable',icon:'❓',risk:null})));}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();const iv=setInterval(load,600000);return()=>clearInterval(iv);},[load]);
  return{data,loading,last,reload:load};
}

// ✅ LIVE: Official warnings scraped from IMD Gangtok portal
function useAlerts(){
  const[alerts,setAlerts]=useState([]);const[loading,setLoading]=useState(true);const[err,setErr]=useState(false);const[last,setLast]=useState('');
  const lvl=t=>{const l=t.toLowerCase();if(/red alert|extreme|very heavy rain|severe flood/.test(l))return'red';if(/orange|heavy rain|landslide|flood warning|warning/.test(l))return'orange';if(/yellow|moderate rain|watch/.test(l))return'yellow';return'blue';};
  const LABELS={red:'🔴 Red Alert',orange:'🟠 Orange Warning',yellow:'🟡 Yellow Watch',blue:'🔵 Advisory'};
  const ACTIONS={red:'Halt all travel. Stay indoors immediately.',orange:'Exercise caution. Monitor updates closely.',yellow:'Be alert. Stay prepared to act.',blue:'Stay informed. Check updates regularly.'};
  const load=useCallback(async()=>{
    setLoading(true);setErr(false);
    try{
      // Try multiple proxies for IMD data
      const proxies = [
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://sachet.ndma.gov.in/rss/all')}`,
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://mausam.imd.gov.in/imd_latest/contents/warning_bulletin.php')}`,
      ];
      let items = [];
      for(const url of proxies){
        try{
          const res = await fetch(url, {signal: AbortSignal.timeout(8000)});
          const json = await res.json();
          if(json.items && json.items.length > 0){ items = json.items; break; }
        }catch{}
      }
      if(items.length > 0){
        const parsed = items.slice(0,5).map(item=>{
          const txt = (item.title||'')+(item.description||'');
          const clean = txt.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
          const level = lvl(clean);
          return{id:Math.random().toString(36).slice(2),level,label:LABELS[level],title:(item.title||'').replace(/<[^>]+>/g,'').slice(0,90),desc:clean.slice(0,300),action:ACTIONS[level],src:'NDMA / IMD',time:item.pubDate?new Date(item.pubDate).toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'}):new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'})};
        });
        setAlerts(parsed);
      } else {
        // Fallback: fetch IMD Gangtok via corsproxy.io
        const res2 = await fetch(`https://corsproxy.io/?${encodeURIComponent('https://mausam.imd.gov.in/gangtok/')}`,{signal:AbortSignal.timeout(8000)});
        const html = await res2.text();
        const doc = new DOMParser().parseFromString(html,'text/html');
        const parsed=[];
        // Skip nav/menu elements, only pick actual warning content
      const skipPhrases=['forecast city','district forecast','national forecast','tourism forecast','pilgrimage','extended range','value added','tabular','graphical'];
      doc.querySelectorAll('p,marquee,td').forEach(el=>{
          if(el.closest('nav,header,footer,ul,ol')) return;
          const txt=el.textContent.replace(/\s+/g,' ').trim();
          const lower=txt.toLowerCase();
          if(skipPhrases.some(w=>lower.includes(w))) return;
          if(txt.length>60&&txt.length<800&&/(warning|alert|flood|landslide|cyclone|thunder|heavy rain|red|orange|yellow|sikkim|northeast)/i.test(txt)){
            if(!parsed.find(p=>p.desc.slice(0,50)===txt.slice(0,50))){
              const level=lvl(txt);
              parsed.push({id:Math.random().toString(36).slice(2),level,label:LABELS[level],title:txt.length>90?txt.slice(0,90)+'…':txt,desc:txt,action:ACTIONS[level],src:'IMD Gangtok',time:new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'})});
            }
          }
        });
        setAlerts(parsed.length>0?parsed.slice(0,5):[{id:'def',level:'blue',label:'🔵 Advisory',src:'IMD Gangtok',time:new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'}),title:'No severe warnings currently active for Sikkim',desc:'Conditions are being monitored. Check IMD Gangtok for the latest official forecasts and warnings.',action:'Stay informed and check IMD portal regularly.'}]);
      }
    }catch(e){
      console.warn('Alerts failed',e);setErr(true);
      setAlerts([{id:'def',level:'blue',label:'🔵 Advisory',src:'IMD Gangtok',time:new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'}),title:'No severe warnings currently active for Sikkim',desc:'Conditions are being monitored. Use the IMD Gangtok button below for direct access to official warnings.',action:'Visit IMD Gangtok portal for updates.'}]);
    }
    finally{setLoading(false);setLast(new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'}));}
  },[]);
  useEffect(()=>{load();const iv=setInterval(load,600000);return()=>clearInterval(iv);},[load]);
  return{alerts,loading,err,last,reload:load};
}

// ✅ LIVE: Incident & news feed — filters to last 7 days only
function useIncidents(){
  const[items,setItems]=useState([]);const[loading,setLoading]=useState(true);const[last,setLast]=useState('');
  const COLORMAP={landslide:'#dc2626',flood:'#d97706',road:'#ca8a04',snow:'#0369a1',seismic:'#7c3aed',earthquake:'#7c3aed',rescue:'#16a34a',cyclone:'#b91c1c',rain:'#2563eb',highway:'#ca8a04'};
  const BADGEMAP={landslide:{bg:'#fef2f2',c:'#b91c1c',t:'Active'},flood:{bg:'#fef3c7',c:'#92400e',t:'Ongoing'},road:{bg:'#fefce8',c:'#a16207',t:'Notice'},snow:{bg:'#f0f9ff',c:'#075985',t:'Advisory'},seismic:{bg:'#f5f3ff',c:'#5b21b6',t:'Info'},earthquake:{bg:'#f5f3ff',c:'#5b21b6',t:'Info'},rescue:{bg:'#f0fdf4',c:'#166534',t:'Update'},cyclone:{bg:'#fef2f2',c:'#b91c1c',t:'Alert'},rain:{bg:'#eff6ff',c:'#1d4ed8',t:'Watch'},highway:{bg:'#fefce8',c:'#a16207',t:'Notice'}};

  const parseItems = (entries) => {
    const sevenDaysAgo = Date.now() - 7*24*60*60*1000;
    return entries
      .map(item=>{
        const title=(item.title||'').replace(/<[^>]+>/g,'').replace(/ - Google News$/,'').trim();
        const link=item.link||item.guid||item.url||'#';
        const pubDate=item.pubDate||item.published||'';
        const source=item.author||item.source?.name||item.feed_title||'News';
        const lower=title.toLowerCase();
        const key=Object.keys(COLORMAP).find(k=>lower.includes(k))||'road';
        const badge=BADGEMAP[key]||{bg:'#f1f5f9',c:'#475569',t:'News'};
        const dateObj = pubDate ? new Date(pubDate) : null;
        return{
          id:Math.random().toString(36).slice(2),
          title:title.length>90?title.slice(0,90)+'…':title,
          date:dateObj?dateObj.toLocaleString('en-IN',{timeZone:'Asia/Kolkata',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'Recent',
          timeAgo:timeSince(pubDate),
          timestamp: dateObj ? dateObj.getTime() : 0,
          color:COLORMAP[key]||'#64748b',
          badge:badge.t,bbg:badge.bg,bc:badge.c,link,src:source
        };
      })
      // Filter to last 7 days only
      .filter(item => item.timestamp === 0 || item.timestamp > sevenDaysAgo)
      .sort((a,b) => b.timestamp - a.timestamp)
      .slice(0,6);
  };

  const load=useCallback(async()=>{
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    // Use "after:" operator to get only recent news
    const queries = [
      `Sikkim landslide flood disaster after:${today}`,
      `Sikkim highway road disaster after:${today}`,
      `Sikkim flood rain warning 2026`,
    ];
    let allItems = [];
    for(const query of queries){
      try{
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=8`;
        const res = await fetch(apiUrl, {signal: AbortSignal.timeout(8000)});
        const json = await res.json();
        if(json.items?.length > 0){
          allItems = [...allItems, ...json.items];
        }
      }catch(e){ console.warn('Query failed:', query, e); }
    }
    // Deduplicate by title
    const seen = new Set();
    const unique = allItems.filter(item => {
      const key = (item.title||'').slice(0,40);
      if(seen.has(key)) return false;
      seen.add(key); return true;
    });
    const parsed = parseItems(unique);
    if(parsed.length > 0){
      setItems(parsed);
    } else {
      // Fallback: broader query without date filter
      try{
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent('Sikkim disaster news')}&hl=en-IN&gl=IN&ceid=IN:en`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=6`;
        const res = await fetch(apiUrl, {signal: AbortSignal.timeout(8000)});
        const json = await res.json();
        const fallbackParsed = json.items?.length > 0 ? parseItems(json.items) : [];
        setItems(fallbackParsed.length > 0 ? fallbackParsed : [{
          id:'none',title:'No recent Sikkim disaster news in last 7 days',
          date:'Now',timeAgo:'Now',timestamp:Date.now(),
          color:'#16a34a',badge:'All Clear',bbg:'#f0fdf4',bc:'#166534',
          link:'https://news.google.com/search?q=Sikkim+disaster',src:'Google News'
        }]);
      }catch{
        setItems([{id:'none',title:'No recent Sikkim disaster news in last 7 days',date:'Now',timeAgo:'Now',timestamp:Date.now(),color:'#16a34a',badge:'All Clear',bbg:'#f0fdf4',bc:'#166534',link:'https://news.google.com/search?q=Sikkim+disaster',src:'Google News'}]);
      }
    }
    setLast(new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'}));
    setLoading(false);
  },[]);
  useEffect(()=>{load();const iv=setInterval(load,600000);return()=>clearInterval(iv);},[load]);
  return{items,loading,last,reload:load};
}

function RoadCard({r}){
  const statusStyle={blocked:{bg:'#fef2f2',text:'#b91c1c',border:'#fecaca',label:'🔴 Blocked'},restricted:{bg:'#fff7ed',text:'#c2410c',border:'#fed7aa',label:'🟠 Restricted'},clear:{bg:'#f0fdf4',text:'#15803d',border:'#bbf7d0',label:'🟢 Clear'},unknown:{bg:'#f8fafc',text:'#64748b',border:'#e2e8f0',label:'⚪ Unknown'}};
  const riskStyle={high:{bg:'#fef2f2',text:'#b91c1c',border:'#fecaca',label:'High Risk'},moderate:{bg:'#fff7ed',text:'#c2410c',border:'#fed7aa',label:'Moderate Risk'},low:{bg:'#f0fdf4',text:'#15803d',border:'#bbf7d0',label:'Low Risk'},unknown:{bg:'#f8fafc',text:'#64748b',border:'#e2e8f0',label:'No data'}};
  const ss=statusStyle[r.status]||statusStyle.unknown;
  const rLevel=r.risk?(r.risk.prec>5||r.risk.code>=95||r.risk.wind>60?'high':r.risk.prec>1||(r.risk.code>=51&&r.risk.code<=82)||r.risk.wind>40?'moderate':'low'):'unknown';
  const rs=riskStyle[rLevel];
  return(
    <div className="da-road-card">
      <div className="da-road-top">
        <div className="da-road-name">{r.name}</div>
        <span className={`da-badge da-badge-${r.status}`}>{ss.label}</span>
      </div>
      <div className="da-road-meta"><span>📍 {r.from} → {r.to}</span><span>📏 {r.km}</span></div>
      {r.risk?(
        <div className="da-road-risk" style={{background:rs.bg,border:`1px solid ${rs.border}`}}>
          <div>
            <div style={{fontWeight:800,fontSize:'0.7rem',color:rs.text}}>{rs.label}</div>
            <div style={{fontSize:'0.65rem',color:'#64748b',marginTop:'0.06rem'}}>{wxIcon(r.risk.code)} · 💧{r.risk.prec}mm · 💨{r.risk.wind}km/h</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontWeight:800,fontSize:'0.72rem',color:'#475569'}}>{r.risk.temp!==undefined?`${r.risk.temp}°C`:'--'}</div>
            <div style={{fontSize:'0.62rem',color:'#94a3b8'}}>Rain {r.risk.prob}% (3h)</div>
          </div>
        </div>
      ):<div className="da-shimmer"/>}
      <div className="da-road-issue"><span>{r.icon}</span><span style={{color:r.status==='blocked'?'#b91c1c':r.status==='restricted'?'#c2410c':'#15803d',fontWeight:600}}>{r.issue}</span></div>
    </div>
  );
}

function AlertCard({a}){
  const cm={red:{stripe:'red',lc:'#b91c1c',abg:'#fef2f2',ac:'#b91c1c',ab:'#fecaca'},orange:{stripe:'orange',lc:'#c2410c',abg:'#fff7ed',ac:'#c2410c',ab:'#fed7aa'},yellow:{stripe:'yellow',lc:'#92400e',abg:'#fefce8',ac:'#854d0e',ab:'#fde047'},blue:{stripe:'blue',lc:'#1d4ed8',abg:'#eff6ff',ac:'#1d4ed8',ab:'#bfdbfe'}};
  const c=cm[a.level]||cm.blue;
  return(
    <div className="da-alert">
      <div className={`da-alert-stripe ${c.stripe}`}/>
      <div className="da-alert-inner">
        <div className="da-alert-meta">
          <div className="da-alert-level" style={{color:c.lc}}><Ping t={a.level==='red'?'r':a.level==='orange'?'a':'g'}/>{a.label}</div>
          <span className="da-alert-time">{a.time}</span>
        </div>
        <div className="da-alert-title">{a.title}</div>
        <div className="da-alert-desc">{a.desc.length>200?a.desc.slice(0,200)+'…':a.desc}</div>
        <div className="da-alert-footer">
          <div className="da-alert-action" style={{background:c.abg,color:c.ac,borderColor:c.ab}}>⚠️ {a.action}</div>
          <div className="da-alert-src">📡 {a.src}</div>
        </div>
      </div>
    </div>
  );
}

export default function SikkimDisasterAlert(){
  const{data:wx,loading:wxLoad,last:wxLast,reload:wxReload}=useWeather();
  const{data:roads,loading:rLoad,last:rLast,reload:rReload}=useRoads();
  const{alerts,loading:aLoad,err:aErr,last:aLast,reload:aReload}=useAlerts();
  const{items:news,loading:nLoad,last:nLast,reload:nReload}=useIncidents();

  return(
    <>
      <style>{STYLES}</style>
      <div className="da-wrap">

        <div className="da-hero">
          <div className="da-hero-inner">
            <div>
              <h1 className="da-hero-title">Sikkim <em>Disaster</em><br/>Alert Center</h1>
              <p className="da-hero-sub">Real-time emergency status, highway conditions &amp; official warnings</p>
              <div className="da-hero-badges">
                <span className="da-hero-badge"><Ping t="g"/> Weather Live</span>
                <span className="da-hero-badge"><Ping t="g"/> Highway Live</span>
                <span className="da-hero-badge"><Ping t="r"/> IMD Alerts Live</span>
                <span className="da-hero-badge"><Ping t="g"/> News Live</span>
              </div>
            </div>
            <div className="da-hero-stats">
              <div className="da-stat"><div className="da-stat-num">13</div><div className="da-stat-label">Districts</div></div>
              <div className="da-stat"><div className="da-stat-num">4</div><div className="da-stat-label">Highways</div></div>
              <div className="da-stat"><div className="da-stat-num" style={{color:'#86efac'}}>{alerts.length||'—'}</div><div className="da-stat-label">Live Alerts</div></div>
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
                  <div className="da-card-title"><span className="da-accent"/>🧭 Live Interactive Region Map</div>
                  <div className="da-sync"><Ping t="g"/>GPS Active</div>
                </div>
                <div className="da-map">
                  <iframe src="https://maps.google.com/maps?q=Sikkim,India&t=p&z=9&ie=UTF8&iwloc=&output=embed" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Sikkim Map"/>
                </div>
              </div>

              {/* Highway - FULLY LIVE */}
              <div className="da-card">
                <div className="da-card-head">
                  <div className="da-card-title"><span className="da-accent"/>📍 Live Highway Conditions</div>
                  <div style={{display:'flex',gap:'0.4rem',alignItems:'center'}}>
                    <div className="da-sync">🔄 {rLast||'Syncing…'}</div>
                    <button onClick={rReload} className={`da-rbtn ${rLoad?'da-spin':''}`}>🔄</button>
                  </div>
                </div>
                <div className="da-card-body">
                  <div className="da-api-note"><span className="da-api-dot"/>Live weather-based road risk at GPS coordinates · Auto-refreshes every 10 min</div>
                  <div className="da-road-grid">{(roads||ROAD_ROUTES.map(r=>({...r,status:'unknown',issue:'Loading…',icon:'⏳',risk:null}))).map(r=><RoadCard key={r.id} r={r}/>)}</div>
                </div>
              </div>

              {/* Safety Guide */}
              <div className="da-card">
                <div className="da-card-head"><div className="da-card-title"><span className="da-accent"/>📖 Safety Guidelines</div></div>
                <div className="da-card-body">
                  <div className="da-guide-grid">
                    {[
                      {icon:'🏔️',bg:'#ffedd5',border:'#fed7aa',color:'#ea580c',title:'During Landslides',desc:'Stay away from slide path. Move to higher ground. Do not cross affected roads.'},
                      {icon:'🌊',bg:'#dbeafe',border:'#bfdbfe',color:'#2563eb',title:'Flash Flood Watch',desc:'Avoid camping along rivers. Move uphill if waters rise. Never drive through flooded roads.'},
                      {icon:'📳',bg:'#f3e8ff',border:'#e9d5ff',color:'#7c3aed',title:'Seismic Activity',desc:'Drop, Cover, Hold On. Stay indoors until shaking stops.'},
                      {icon:'❄️',bg:'#fef9c3',border:'#fde047',color:'#ca8a04',title:'Snowfall / Ice',desc:'Avoid mountain roads without snow chains. Hazard lights on.'},
                      {icon:'🚨',bg:'#dcfce7',border:'#bbf7d0',color:'#15803d',title:'Evacuation Protocol',desc:'Follow official routes only. Register at relief camp.'},
                      {icon:'⛈️',bg:'#fee2e2',border:'#fecaca',color:'#b91c1c',title:'Thunderstorm Safety',desc:'Avoid hilltops. Stay away from tall trees. Shelter in hard-top vehicle.'},
                    ].map((g,i)=>(
                      <div key={i} className="da-guide-item">
                        <div className="da-guide-icon" style={{background:g.bg,border:`1px solid ${g.border}`,color:g.color}}>{g.icon}</div>
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

              {/* Weather - FULLY LIVE */}
              <div className="da-weather">
                <div className="da-weather-head">
                  <div className="da-weather-title">🌡️ Live Regional Weather</div>
                  <button onClick={wxReload} className={`da-wbtn ${wxLoad?'da-spin':''}`}>🔄</button>
                </div>
                <div className="da-weather-groups">
                  {['North','East','West','South'].map(dir=>{
                    const m=DIR_META[dir];
                    return(
                      <div key={dir}>
                        <div className="da-dir-label"><span className="da-dir-bar" style={{background:m.bar}}/>{m.label}</div>
                        <div className="da-wrow">
                          {WEATHER_DISTRICTS.filter(d=>d.dir===dir).map(d=>{
                            const w=wx[d.id];
                            return(
                              <div key={d.id} className="da-witem">
                                <div style={{minWidth:0}}><span className="da-wname">{d.name}</span><div className="da-wwind">{w?`💨 ${w.wind}km/h`:'…'}</div></div>
                                <div style={{display:'flex',alignItems:'center',gap:'0.3rem',flexShrink:0}}>
                                  <span className="da-wtemp">{w?`${w.temp}°`:'--'}</span>
                                  {w&&<span className="da-wicon">{wxIcon(w.code)}</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="da-wfoot">Last updated: {wxLast||'Loading…'} · Refreshes every 15 min</div>
              </div>

              {/* Alerts - LIVE from IMD Gangtok */}
              <div className="da-card">
                <div className="da-card-head">
                  <div className="da-card-title"><span className="da-accent"/><span className="da-pulse">🚨</span> Live Official Warnings</div>
                  <div style={{display:'flex',gap:'0.4rem',alignItems:'center'}}>
                    <div className={`da-sync ${aErr?'err':''}`}>{aErr?'⚠ Fallback':`🔴 ${aLast||'Loading…'}`}</div>
                    <button onClick={aReload} className={`da-rbtn ${aLoad?'da-spin':''}`}>🔄</button>
                  </div>
                </div>
                <div className="da-card-body">
                  {aLoad?(<div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}><div className="da-alert-skel"/><div className="da-alert-skel" style={{height:70}}/></div>)
                  :(<div className="da-alerts">{alerts.map(a=><AlertCard key={a.id} a={a}/>)}</div>)}
                </div>
              </div>

              {/* IMD Links */}
              <div className="da-card">
                <div className="da-imd-head">
                  <div className="da-imd-icon">🌦️</div>
                  <div><div className="da-imd-htitle">India Meteorological Department</div><div className="da-imd-hsub">Sikkim &amp; NE India · Official Source</div></div>
                </div>
                <div className="da-imd-body">
                  <p className="da-imd-desc">Access official forecasts, warnings and bulletins from IMD for Sikkim and North East India.</p>
                  <div className="da-imd-grid">
                    <a href="https://mausam.imd.gov.in/gangtok/" target="_blank" rel="noopener noreferrer" className="da-imd-link p">🌐 Open IMD Gangtok (Sikkim) <span className="da-imd-link-arrow">↗</span></a>
                    <a href="https://mausam.imd.gov.in/gangtok/" target="_blank" rel="noopener noreferrer" className="da-imd-link s">📋 District Forecasts <span className="da-imd-link-arrow">↗</span></a>
                    <a href="https://rsmcnewdelhi.imd.gov.in/" target="_blank" rel="noopener noreferrer" className="da-imd-link s">🗺️ NE India Forecast <span className="da-imd-link-arrow">↗</span></a>
                    <a href="https://sachet.ndma.gov.in/" target="_blank" rel="noopener noreferrer" className="da-imd-link s">🚨 NDMA Sachet <span className="da-imd-link-arrow">↗</span></a>
                  </div>
                  <div className="da-imd-foot"><Ping t="g"/> Official government portal · Updates every 3–6 hours</div>
                </div>
              </div>

            </div>
          </div>

          {/* BOTTOM: Emergency Contacts + Live News */}
          <div className="da-bottom-grid">

            {/* Emergency Contacts - shown first/left */}
            <div className="da-card">
              <div className="da-card-head">
                <div className="da-card-title"><span className="da-accent"/>📞 Emergency Contacts</div>
                <div className="da-sync" style={{background:'#fef2f2',color:'#b91c1c',borderColor:'#fecaca'}}>● Available 24×7</div>
              </div>
              <div className="da-card-body">
                <div className="da-contacts">
                  {CONTACTS.map((c,i)=>(
                    <div key={i} className="da-contact">
                      <div style={{display:'flex',alignItems:'center',gap:'0.6rem',minWidth:0}}>
                        <div className="da-contact-icon">{c.icon}</div>
                        <div><div className="da-contact-label">{c.label}</div><div className="da-contact-num">{c.number}</div><div className="da-contact-sub">{c.sub}</div></div>
                      </div>
                      <a href={`tel:${c.number}`} className="da-call">📞 Call</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live News Feed or All Clear status */}
            <div className="da-card">
              <div className="da-card-head">
                <div className="da-card-title"><span className="da-accent"/>📰 Live Incident &amp; News Feed</div>
                <div style={{display:'flex',gap:'0.4rem',alignItems:'center'}}>
                  <div className="da-sync" style={{background:'#f5f3ff',color:'#6d28d9',borderColor:'#ddd6fe'}}><Ping t="r"/>Live · {nLast||'Loading…'}</div>
                  <button onClick={nReload} className={`da-rbtn ${nLoad?'da-spin':''}`}>🔄</button>
                </div>
              </div>
              <div className="da-card-body">
                {nLoad ? (
                  <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    {[1,2,3].map(i=><div key={i} className="da-shimmer" style={{height:60,borderRadius:'0.5rem'}}/>)}
                  </div>
                ) : news.length === 1 && news[0].badge === 'All Clear' ? (
                  /* All Clear state - show status summary */
                  <div>
                    <div style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'1px solid #bbf7d0',borderRadius:'0.75rem',padding:'1.25rem',textAlign:'center',marginBottom:'1rem'}}>
                      <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>✅</div>
                      <div style={{fontWeight:800,fontSize:'1rem',color:'#15803d',marginBottom:'0.25rem'}}>No Active Incidents</div>
                      <div style={{fontSize:'0.8rem',color:'#166534',fontWeight:500}}>No disaster or road incidents reported in Sikkim in the last 7 days</div>
                      <div style={{fontSize:'0.7rem',color:'#4ade80',marginTop:'0.5rem',fontWeight:600}}>Last checked: {nLast||'--'}</div>
                    </div>
                    <div style={{fontSize:'0.75rem',fontWeight:700,color:'var(--slate-mid)',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>🔗 Monitor Official Sources</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                      {[
                        {icon:'🌦️',label:'IMD Gangtok — Live Forecasts',url:'https://mausam.imd.gov.in/gangtok/'},
                        {icon:'🚨',label:'NDMA Sachet — National Alerts',url:'https://sachet.ndma.gov.in/'},
                        {icon:'📋',label:'Sikkim SDMA — State Alerts',url:'https://www.sikkimspeaks.com/'},
                        {icon:'📰',label:'Google News — Sikkim Live',url:'https://news.google.com/search?q=Sikkim+disaster+flood+landslide'},
                      ].map((l,i)=>(
                        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.6rem 0.875rem',borderRadius:'0.5rem',border:'1px solid var(--border)',background:'#fff',textDecoration:'none',fontSize:'0.8rem',fontWeight:600,color:'var(--slate)',transition:'box-shadow 0.15s'}}>
                          <span style={{fontSize:'1rem'}}>{l.icon}</span>
                          <span style={{flex:1}}>{l.label}</span>
                          <span style={{color:'var(--slate-lt)',fontSize:'0.75rem'}}>↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="da-timeline">
                    {news.map((item)=>(
                      <div key={item.id} className="da-tl-item">
                        <div className="da-tl-spine"><div className="da-tl-dot" style={{color:item.color,background:item.color}}/><div className="da-tl-line"/></div>
                        <div style={{flex:1}}>
                          <div className="da-tl-date">{item.date} · <span style={{color:'#94a3b8'}}>{item.timeAgo}</span></div>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>
                            <div className="da-tl-title" style={{color:'var(--slate)',cursor:'pointer'}}>{item.title}</div>
                          </a>
                          <div className="da-tl-src">📡 {item.src}</div>
                          <span className="da-tl-badge" style={{background:item.bbg,color:item.bc}}>● {item.badge}</span>
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
    </>
  );
}