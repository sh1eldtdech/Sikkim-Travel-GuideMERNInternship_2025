import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = (secret) => ({ headers: { "x-admin-secret": secret } });
const fmt = (n) => (n ?? 0).toLocaleString("en-IN");

/* ── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, accent }) => (
  <div
    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
    style={{ borderLeft: `4px solid ${accent}` }}
  >
    <div className="text-2xl font-bold text-gray-800">{fmt(value)}</div>
    <div className="text-sm font-medium text-gray-600">{label}</div>
    {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
  </div>
);

/* ── Badge ──────────────────────────────────────────────────── */
const Badge = ({ children, color }) => {
  const map = {
    pending:  "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-600",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[color] || map.pending}`}>
      {children}
    </span>
  );
};

/* ── Confirmation Modal ─────────────────────────────────────── */
const Confirm = ({ msg, onYes, onNo }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
      <p className="text-gray-700 font-medium">{msg}</p>
      <div className="flex gap-3">
        <button onClick={onNo}  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition">Cancel</button>
        <button onClick={onYes} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">Confirm</button>
      </div>
    </div>
  </div>
);

/* ── Tabs config ────────────────────────────────────────────── */
const TABS = [
  { key: "overview",      label: "Overview" },
  { key: "hotelOwners",   label: "Hotel Owners" },
  { key: "hotels",        label: "Hotel Listings" },
  { key: "bikeOwners",    label: "Bike Rental Owners" },
  { key: "bikes",         label: "Bike Listings" },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [secret, setSecret]           = useState(localStorage.getItem("adminSecret") || "");
  const [authed, setAuthed]           = useState(!!localStorage.getItem("adminSecret"));
  const [tab, setTab]                 = useState("overview");
  const [stats, setStats]             = useState(null);
  const [hotels, setHotels]           = useState([]);
  const [bikes, setBikes]             = useState([]);
  const [hotelOwners, setHotelOwners] = useState([]);
  const [bikeOwners, setBikeOwners]   = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [confirm, setConfirm]         = useState(null);
  const [toast, setToast]             = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(""), 5000); };

  /* ── fetch stats ── */
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE}/admin/stats`, api(secret));
      setStats(data);
    } catch (e) {
      if (e.response?.status === 403) handleLogout();
    }
  }, [secret]);

  /* ── fetch data per tab ── */
  const fetchTab = useCallback(async (t) => {
    if (t === "overview") { fetchStats(); return; }
    setLoading(true);
    setError("");
    try {
      if (t === "hotels") {
        const { data } = await axios.get(`${BASE}/admin/hotels/pending`, api(secret));
        setHotels(data.hotels || []);
      }
      if (t === "bikes") {
        const { data } = await axios.get(`${BASE}/admin/bikes/pending`, api(secret));
        setBikes(data.bikes || []);
      }
      if (t === "hotelOwners") {
        const { data } = await axios.get(`${BASE}/admin/owners?status=pending`, api(secret));
        setHotelOwners(data.owners || []);
      }
      if (t === "bikeOwners") {
        const { data } = await axios.get(`${BASE}/admin/bike-owners?status=pending`, api(secret));
        setBikeOwners(data.bikeOwners || []);
      }
    } catch (e) {
      showError(e.response?.data?.message || "Failed to load data.");
      if (e.response?.status === 403) handleLogout();
    } finally {
      setLoading(false);
    }
  }, [secret, fetchStats]);

  useEffect(() => { if (authed) fetchTab(tab); }, [authed, tab]);
  useEffect(() => { if (authed && tab === "overview") fetchStats(); }, [authed]);

  /* ── auth ── */
  const handleAuth = () => {
    if (!secret.trim()) return;
    localStorage.setItem("adminSecret", secret);
    setAuthed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSecret");
    setAuthed(false);
  };

  /* ── approve/reject LISTING (hotels or bikes) ── */
  const doListingAction = async (entity, id, action) => {
    try {
      await axios.patch(`${BASE}/admin/${entity}/${id}/${action}`, {}, api(secret));
      const label = entity === "hotels" ? "Hotel" : "Bike";
      showToast(`${label} ${action}d successfully!`);
      if (entity === "hotels") setHotels((p) => p.filter((h) => h._id !== id));
      if (entity === "bikes")  setBikes((p) => p.filter((b) => b._id !== id));
      fetchStats();
    } catch (e) {
      showError(e.response?.data?.message || `Failed to ${action}.`);
    }
  };

  /* ── approve/reject OWNER ACCOUNT ── */
  const doOwnerAction = async (ownerType, id, status, rejectionReason) => {
    try {
      const endpoint = ownerType === "hotel"
        ? `${BASE}/admin/verify-owner/${id}`
        : `${BASE}/admin/verify-bike-owner/${id}`;
      await axios.put(endpoint, { status, rejectionReason }, api(secret));
      const label = ownerType === "hotel" ? "Hotel owner" : "Bike rental owner";
      showToast(`${label} ${status} successfully!`);
      if (ownerType === "hotel")  setHotelOwners((p) => p.filter((o) => o._id !== id));
      if (ownerType === "bike")   setBikeOwners((p) => p.filter((o) => o._id !== id));
      fetchStats();
    } catch (e) {
      showError(e.response?.data?.message || `Failed to update owner status.`);
    }
  };

  const ask = (msg, onYes) => setConfirm({ msg, onYes });

  /* ═══════════════════════════
     AUTH GATE
  ═══════════════════════════ */
  if (!authed) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 font-[Poppins]">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-400 text-sm">Sikkim Travel Guide — Business Management</p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Enter Admin Secret Key"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 text-sm"
          />
          <button
            onClick={handleAuth}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════
     DASHBOARD
  ═══════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <Confirm
          msg={confirm.msg}
          onYes={() => { confirm.onYes(); setConfirm(null); }}
          onNo={() => setConfirm(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-gray-800 leading-tight text-sm sm:text-base">Admin Dashboard</h1>
            <p className="text-xs text-gray-400 hidden sm:block">Sikkim Travel Guide — All Businesses</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors font-medium"
          >
            Logout
          </button>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 pb-0 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
              {/* Pending count badges */}
              {stats && t.key === "hotelOwners" && stats.pendingHotelOwners > 0 && (
                <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingHotelOwners}
                </span>
              )}
              {stats && t.key === "hotels" && stats.pendingHotels > 0 && (
                <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingHotels}
                </span>
              )}
              {stats && t.key === "bikeOwners" && stats.pendingBikeOwners > 0 && (
                <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingBikeOwners}
                </span>
              )}
              {stats && t.key === "bikes" && stats.pendingBikes > 0 && (
                <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingBikes}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* ══ OVERVIEW TAB ══ */}
        {tab === "overview" && stats && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Platform Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <StatCard label="Hotel Owners" value={stats.totalHotelOwners} sub={`${stats.pendingHotelOwners} pending approval`} accent="#6366f1" />
                <StatCard label="Bike Rental Owners" value={stats.totalBikeOwners} sub={`${stats.pendingBikeOwners} pending approval`} accent="#f59e0b" />
                <StatCard label="Hotel Listings" value={stats.totalHotels} sub={`${stats.pendingHotels} pending approval`} accent="#10b981" />
                <StatCard label="Bike Listings" value={stats.totalBikes} sub={`${stats.pendingBikes} pending approval`} accent="#f97316" />
                <StatCard label="Total Bookings" value={stats.totalBookings} accent="#8b5cf6" />
                <StatCard label="Total Revenue" value={`₹${fmt(stats.totalRevenue)}`} accent="#14b8a6" />
                <StatCard label="Pending Listings" value={stats.totalPendingListings} sub="Hotels + Bikes" accent="#ef4444" />
                <StatCard label="Pending Accounts" value={stats.totalPendingOwners} sub="Owner accounts awaiting approval" accent="#ec4899" />
              </div>
            </div>

            {/* Quick action cards */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Hotel Owner Accounts", key: "hotelOwners", count: stats.pendingHotelOwners },
                  { label: "Hotel Listings", key: "hotels", count: stats.pendingHotels },
                  { label: "Bike Owner Accounts", key: "bikeOwners", count: stats.pendingBikeOwners },
                  { label: "Bike Listings", key: "bikes", count: stats.pendingBikes },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className="text-left bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <div className="font-bold text-gray-800 text-sm">{item.label}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {item.count > 0
                        ? <span className="text-amber-600 font-medium">{item.count} pending</span>
                        : "No pending items"}
                    </div>
                    <span className="mt-2 inline-block text-xs text-indigo-600 font-medium">Review →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ HOTEL OWNERS TAB ══ */}
        {tab === "hotelOwners" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Pending Hotel Owner Accounts</h2>
              <button onClick={() => fetchTab("hotelOwners")} className="text-sm text-indigo-600 hover:underline">Refresh</button>
            </div>
            {loading ? <ListingLoader /> : hotelOwners.length === 0 ? (
              <EmptyState msg="All hotel owner accounts are reviewed!" />
            ) : (
              <div className="space-y-3">
                {hotelOwners.map((owner) => (
                  <OwnerCard
                    key={owner._id}
                    owner={owner}
                    type="Hotel Owner"
                    onApprove={() => ask("Approve this hotel owner account?", () => doOwnerAction("hotel", owner._id, "approved"))}
                    onReject={() => ask("Reject this hotel owner account?", () => doOwnerAction("hotel", owner._id, "rejected", "Account rejected by admin"))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ HOTELS TAB ══ */}
        {tab === "hotels" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Pending Hotel Listings</h2>
              <button onClick={() => fetchTab("hotels")} className="text-sm text-indigo-600 hover:underline">Refresh</button>
            </div>
            {loading ? <ListingLoader /> : hotels.length === 0 ? (
              <EmptyState msg="All hotel listings are reviewed!" />
            ) : (
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <ListingCard
                    key={hotel._id}
                    type="Hotel"
                    name={hotel.name}
                    detail={`${hotel.district || ""} Sikkim · ${hotel.location || ""}`}
                    owner={hotel.owner}
                    images={hotel.images}
                    meta={[
                      hotel.paymentDetails?.upiId && `UPI: ${hotel.paymentDetails.upiId}`,
                      hotel.amenities?.length && `${hotel.amenities.length} amenities`,
                    ].filter(Boolean)}
                    onApprove={() => ask("Approve this hotel listing?", () => doListingAction("hotels", hotel._id, "approve"))}
                    onReject={() => ask("Reject and remove this hotel?", () => doListingAction("hotels", hotel._id, "reject"))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ BIKE OWNERS TAB ══ */}
        {tab === "bikeOwners" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Pending Bike Rental Owner Accounts</h2>
              <button onClick={() => fetchTab("bikeOwners")} className="text-sm text-indigo-600 hover:underline">Refresh</button>
            </div>
            {loading ? <ListingLoader /> : bikeOwners.length === 0 ? (
              <EmptyState msg="All bike rental owner accounts are reviewed!" />
            ) : (
              <div className="space-y-3">
                {bikeOwners.map((owner) => (
                  <OwnerCard
                    key={owner._id}
                    owner={owner}
                    type="Bike Rental Owner"
                    onApprove={() => ask("Approve this bike rental owner account?", () => doOwnerAction("bike", owner._id, "approved"))}
                    onReject={() => ask("Reject this bike rental owner account?", () => doOwnerAction("bike", owner._id, "rejected", "Account rejected by admin"))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ BIKES TAB ══ */}
        {tab === "bikes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Pending Bike Rental Listings</h2>
              <button onClick={() => fetchTab("bikes")} className="text-sm text-indigo-600 hover:underline">Refresh</button>
            </div>
            {loading ? <ListingLoader /> : bikes.length === 0 ? (
              <EmptyState msg="All bike listings are reviewed!" />
            ) : (
              <div className="space-y-4">
                {bikes.map((bike) => (
                  <ListingCard
                    key={bike._id}
                    type="Bike"
                    name={bike.name}
                    detail={`${bike.cc || ""}cc · ${bike.district || ""} Sikkim · ${bike.location || ""}`}
                    owner={bike.owner}
                    images={bike.images}
                    meta={[
                      bike.hourlyRate && `Rs.${bike.hourlyRate}/hr`,
                      bike.dailyRate && `Rs.${bike.dailyRate}/day`,
                      bike.contactNumber,
                    ].filter(Boolean)}
                    onApprove={() => ask("Approve this bike listing?", () => doListingAction("bikes", bike._id, "approve"))}
                    onReject={() => ask("Reject and remove this bike?", () => doListingAction("bikes", bike._id, "reject"))}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

/* ─── Owner Account Card ──────────────────────────────────── */
const OwnerCard = ({ owner, type, onApprove, onReject }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800">{owner.name}</h3>
          <Badge color="pending">Pending</Badge>
        </div>
        <div className="text-sm text-gray-500 space-y-0.5">
          <div>Email: {owner.email}</div>
          <div>Phone: {owner.phone || "Not provided"}</div>
          <div>Type: {type}</div>
          <div>Registered: {new Date(owner.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onApprove}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
);

/* ─── Listing Card (Hotels & Bikes) ───────────────────────── */
const ListingCard = ({ type, name, detail, owner, images, meta, onApprove, onReject }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row">
      {/* Image */}
      <div className="sm:w-48 h-36 sm:h-auto shrink-0 bg-gray-100 relative overflow-hidden">
        {images?.length > 0
          ? <img src={images[0]} alt={name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
              No Image
            </div>
        }
        {images?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            +{images.length - 1} photos
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge color="pending">Pending</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <div>
          <h3 className="font-bold text-gray-800 text-base">{name}</h3>
          <p className="text-sm text-gray-500">{detail}</p>
          <p className="text-xs text-gray-400 mt-0.5">Type: {type}</p>
        </div>

        {/* Owner info */}
        {owner && (
          <div className="text-sm text-gray-500 space-x-2">
            <span className="font-medium text-gray-700">{owner.name}</span>
            <span className="text-gray-400">|</span>
            <span>{owner.email}</span>
            {owner.phone && <><span className="text-gray-400">|</span><span>{owner.phone}</span></>}
          </div>
        )}
        {!owner && (
          <div className="text-sm text-gray-400 italic">Owner info not available</div>
        )}

        {/* Meta tags */}
        {meta?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meta.map((m, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{m}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <button
            onClick={onApprove}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ListingLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
    <p className="text-gray-400 text-sm">Loading...</p>
  </div>
);

const EmptyState = ({ msg }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
    <h3 className="font-bold text-gray-600">{msg}</h3>
    <p className="text-gray-400 text-sm">Check back later for new submissions.</p>
  </div>
);

export default AdminDashboard;
