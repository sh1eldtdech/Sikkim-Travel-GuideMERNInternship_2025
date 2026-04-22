import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBikeOwnerAuth } from "../../../context/BikeOwnerAuthContext";
import API from "../../../utils/api";
import { ArrowLeft, Plus, MapPin, Phone, Edit3, Trash2, PowerOff, Power, CheckCircle, Clock } from "lucide-react";

const MyBikes = () => {
  const navigate = useNavigate();
  const { bikeOwnerToken } = useBikeOwnerAuth();
  const authHeader = { headers: { Authorization: `Bearer ${bikeOwnerToken}` } };
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  const fetchBikes = async () => {
    try {
      const { data } = await API.get("/bikes/owner/my-bikes", authHeader);
      setBikes(data.bikes || []);
    } catch (err) {
      toast.error("Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBikes(); }, []);

  const handleToggleStatus = async (bike) => {
    setToggling(bike._id);
    try {
      const newStatus = !bike.isActive;
      await API.patch(`/bikes/${bike._id}/status`, { isActive: newStatus }, authHeader);
      setBikes((prev) => prev.map((b) => (b._id === bike._id ? { ...b, isActive: newStatus } : b)));
      toast.success(`Bike ${newStatus ? "activated" : "deactivated"}!`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this bike?")) return;
    try {
      await API.delete(`/bikes/${id}`, authHeader);
      setBikes((prev) => prev.filter((b) => b._id !== id));
      toast.success("Bike deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/owner/bike-rental/dashboard")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Bike Fleet</h1>
              <p className="text-sm font-medium text-gray-500">Manage your active and pending listings</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/owner/bike-rental/add-bike")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors shadow-md shadow-orange-200 shrink-0"
          >
            <Plus size={18} /> Add New Bike
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : bikes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-4xl mb-4">🏍️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No bikes listed yet</h2>
            <p className="text-gray-500 font-medium mb-6">Start capitalizing on your fleet by adding your first bike.</p>
            <button
              onClick={() => navigate("/owner/bike-rental/add-bike")}
              className="px-6 py-3 rounded-xl bg-orange-500 text-white font-bold shadow-md hover:bg-orange-600 transition-colors"
            >
              List a Bike
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <div key={bike._id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-shadow hover:shadow-lg ${!bike.isActive ? "border-gray-100 opacity-80" : "border-gray-200"}`}>
                
                {/* Image Section */}
                <div className="relative h-48 bg-gray-100">
                  {bike.images?.length > 0 ? (
                    <img src={bike.images[0]} alt={bike.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🏍️</div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {!bike.isApproved ? (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm"><Clock size={12}/> Pending</span>
                    ) : bike.isActive ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm"><CheckCircle size={12}/> Active</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-bold rounded-full shadow-sm">Inactive</span>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{bike.name}</h3>
                    <div className="text-sm text-gray-500 font-medium">{bike.cc}cc Engine</div>
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <MapPin size={16} className="text-gray-400" /> {bike.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <Phone size={16} className="text-gray-400" /> {bike.contactNumber}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-orange-50 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-orange-600">₹{bike.hourlyRate}</div>
                      <div className="text-xs font-semibold text-orange-400 mt-0.5">per hour</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-emerald-600">₹{bike.dailyRate}</div>
                      <div className="text-xs font-semibold text-emerald-400 mt-0.5">per day</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => navigate("/owner/bike-rental/add-bike", { state: { bikeData: bike } })}
                      className="col-span-1 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 size={16}/> Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(bike)} disabled={toggling === bike._id}
                      className={`col-span-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        bike.isActive ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {bike.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => handleDelete(bike._id)}
                      className="col-span-1 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={16}/> Drop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBikes;
