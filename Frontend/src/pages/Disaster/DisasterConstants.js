// Static constants for the Disaster Alert page

export const WEATHER_DISTRICTS = [
  { id: "mangan", name: "Mangan", dir: "North", lat: 27.514, lon: 88.5323 },
  { id: "chungthang", name: "Chungthang", dir: "North", lat: 27.6138, lon: 88.4891 },
  { id: "lachen", name: "Lachen", dir: "North", lat: 27.7279, lon: 88.5596 },
  { id: "lachung", name: "Lachung", dir: "North", lat: 27.6879, lon: 88.7458 },
  { id: "gangtok", name: "Gangtok", dir: "East", lat: 27.3314, lon: 88.6138 },
  { id: "rongli", name: "Rongli", dir: "East", lat: 27.1965, lon: 88.75 },
  { id: "nathula", name: "Nathu La", dir: "East", lat: 27.3869, lon: 88.8348 },
  { id: "gyalshing", name: "Gyalshing", dir: "West", lat: 27.2831, lon: 88.2427 },
  { id: "pelling", name: "Pelling", dir: "West", lat: 27.2968, lon: 88.2293 },
  { id: "yuksom", name: "Yuksom", dir: "West", lat: 27.3415, lon: 88.2119 },
  { id: "namchi", name: "Namchi", dir: "South", lat: 27.1672, lon: 88.3575 },
  { id: "jorethang", name: "Jorethang", dir: "South", lat: 27.1037, lon: 88.3174 },
  { id: "ravangla", name: "Ravangla", dir: "South", lat: 27.3025, lon: 88.3612 },
];

export const DIR_META = {
  North: { label: "North Sikkim", bar: "#0ea5e9" },
  East:  { label: "East Sikkim",  bar: "#10b981" },
  West:  { label: "West Sikkim",  bar: "#a855f7" },
  South: { label: "South Sikkim", bar: "#f97316" },
};

export const ROAD_ROUTES = [
  { id: "nh10",   name: "NH-10 (Siliguri-Gangtok)",         lat: 27.1726, lon: 88.5322, km: "148 km", from: "Siliguri", to: "Gangtok" },
  { id: "nsh",    name: "North Sikkim Hwy (Gangtok-Mangan)", lat: 27.23,   lon: 88.5,   km: "64 km",  from: "Gangtok",  to: "Mangan" },
  { id: "namchi", name: "Gangtok to Namchi",                  lat: 27.25,   lon: 88.45,  km: "78 km",  from: "Gangtok",  to: "Namchi" },
  { id: "pelling",name: "Namchi to Gyalshing",                lat: 27.22,   lon: 88.3,   km: "55 km",  from: "Namchi",   to: "Gyalshing" },
];

export const CONTACTS = [
  { label: "State Disaster Management", number: "1070",          sub: "24x7 Control Room",         icon: "🏛️" },
  { label: "Police Control Room",        number: "100",           sub: "Gangtok HQ",                icon: "🚔" },
  { label: "Fire & Emergency",           number: "101",           sub: "All Districts",             icon: "🚒" },
  { label: "Ambulance / Medical",        number: "108",           sub: "STNM Hospital",             icon: "🚑" },
  { label: "NDRF Helpline",             number: "9436777111",    sub: "National Disaster Response", icon: "⛑️" },
  { label: "PWD Road Clearance",         number: "03592-202395", sub: "Road condition updates",    icon: "🛤️" },
  { label: "Tourist Helpline",           number: "1364",          sub: "For stranded tourists",     icon: "🗺️" },
];

export const SAFETY_GUIDES = [
  { icon: "🏔️", bg: "#ffedd5", border: "#fed7aa", color: "#ea580c", title: "During Landslides",   desc: "Stay away from slide path. Move to higher ground. Do not cross affected roads." },
  { icon: "🌊", bg: "#dbeafe", border: "#bfdbfe", color: "#2563eb", title: "Flash Flood Watch",   desc: "Avoid camping along rivers. Move uphill if waters rise. Never drive through flooded roads." },
  { icon: "📳", bg: "#f3e8ff", border: "#e9d5ff", color: "#7c3aed", title: "Seismic Activity",    desc: "Drop, Cover, Hold On. Stay indoors until shaking stops." },
  { icon: "❄️", bg: "#fef9c3", border: "#fde047", color: "#ca8a04", title: "Snowfall / Ice",      desc: "Avoid mountain roads without snow chains. Hazard lights on." },
  { icon: "🚨", bg: "#dcfce7", border: "#bbf7d0", color: "#15803d", title: "Evacuation Protocol", desc: "Follow official routes only. Register at relief camp." },
  { icon: "⛈️", bg: "#fee2e2", border: "#fecaca", color: "#b91c1c", title: "Thunderstorm Safety", desc: "Avoid hilltops. Stay away from tall trees. Shelter in hard-top vehicle." },
];

export const OFFICIAL_SOURCES = [
  { icon: "🌦️", label: "IMD Gangtok — Live Forecasts",    url: "https://mausam.imd.gov.in/gangtok/" },
  { icon: "🚨", label: "NDMA Sachet — National Alerts",   url: "https://sachet.ndma.gov.in/" },
  { icon: "📋", label: "Sikkim SDMA — State Alerts",      url: "https://www.sikkimspeaks.com/" },
  { icon: "📰", label: "Google News — Sikkim Live",       url: "https://news.google.com/search?q=Sikkim+disaster+flood+landslide" },
];

export const DEPT_LABEL = {
  Tourism: "Tourism Dept.", Police: "Police Dept.", Disaster: "Disaster Mgmt.",
  Revenue: "Revenue Dept.", Health: "Health Dept.", PWD: "PWD (Roads)", Forest: "Forest Dept.",
};

export const SEV_LABELS = { Low: "Low", Medium: "Medium", High: "High", Critical: "Critical" };
