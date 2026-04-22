import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBikeOwnerAuth } from "../../../context/BikeOwnerAuthContext";
import API from "../../../utils/api";
import {
  Bike, PlusCircle, ClipboardList, LogOut,
  Package, CheckCircle, Clock, TrendingUp
} from "lucide-react";

const BikeRentalDashboard = () => {
  const navigate = useNavigate();
  const { bikeOwner, logout } = useBikeOwnerAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/bikes/owner/my-bikes");
        const bikes = data.bikes || [];
        setStats({
          total: bikes.length,
          active: bikes.filter((b) => b.isActive && b.isApproved).length,
          pending: bikes.filter((b) => !b.isApproved).length,
        });
      } catch {
        // silently ignore — stats not critical
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navCards = [
    {
      label: "My Bikes",
      desc: "View, edit, and manage your listed bikes",
      path: "/owner/bike-rental/my-bikes",
      icon: <Bike size={28} />,
      color: "from-amber-400 to-orange-500",
      accent: "text-orange-500",
    },
    {
      label: "List New Bike",
      desc: "Expand your fleet by adding a new bike",
      path: "/owner/bike-rental/add-bike",
      icon: <PlusCircle size={28} />,
      color: "from-emerald-400 to-teal-500",
      accent: "text-emerald-500",
    },
    {
      label: "Bookings",
      desc: "Track and manage customer reservations",
      path: "/owner/bike-rental/bookings",
      icon: <ClipboardList size={28} />,
      color: "from-blue-400 to-indigo-500",
      accent: "text-blue-500",
    },
  ];

  const statCards = [
    { label: "Total Bikes", val: stats.total, icon: <Package size={24} />, bg: "bg-orange-50", text: "text-orange-600" },
    { label: "Active Listings", val: stats.active, icon: <CheckCircle size={24} />, bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "Pending Approval", val: stats.pending, icon: <Clock size={24} />, bg: "bg-amber-50", text: "text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-orange-500">
              <Bike size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rental Dashboard</h1>
              <p className="text-sm text-gray-500 font-medium">Sikkim Travel Guide Business</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-semibold shadow-sm w-max"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl shadow-gray-200/50 text-white p-8 sm:p-10">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-orange-200 mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Partner Portal
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {bikeOwner?.name || "Partner"}!</h2>
            <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
              Manage your bike fleet, track your business performance, and expand your reach across Sikkim from your unified dashboard.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {statCards.map((s, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${s.bg} ${s.text}`}>
                {s.icon}
              </div>
              <div>
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {loading ? <span className="text-gray-300 animate-pulse">—</span> : s.val}
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="pt-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {navCards.map((c, idx) => (
              <div
                key={idx}
                onClick={() => navigate(c.path)}
                className="group cursor-pointer bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center mb-5 shadow-lg`}>
                  {c.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{c.label}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{c.desc}</p>
                <div className={`inline-flex items-center font-semibold text-sm ${c.accent} group-hover:translate-x-1 transition-transform`}>
                  Manage <span className="ml-1">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BikeRentalDashboard;
