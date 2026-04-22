import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../utils/api";
import { Search, MapPin, Filter, Target, Maximize2 } from "lucide-react";

const DISTRICTS = ["All", "East", "West", "North", "South", "Other"];

const BikeList = () => {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("All");
  const [error, setError] = useState("");

  const fetchBikes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (district !== "All") params.district = district;
      const { data } = await API.get("/bikes", { params });
      setBikes(data.bikes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBikes(); }, [district]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBikes();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] pb-16">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-36 pb-24 px-4 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[100%] rounded-full bg-gradient-to-b from-orange-500 to-transparent blur-3xl"></div>
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[80%] rounded-full bg-gradient-to-t from-orange-600 to-transparent blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-bold tracking-widest text-orange-400 uppercase mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> Sikkim Bike Rentals
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Explore Sikkim <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">On Two Wheels</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-medium">
            Rent trusted, well-maintained bikes including Royal Enfields, scooters, and MTBs directly from verified local owners.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row max-w-2xl mx-auto bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="flex-1 flex items-center px-4 py-2">
              <Search className="text-gray-400 mr-3" size={20} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models, brands, or locations..."
                className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 font-medium text-lg"
              />
            </div>
            <button
              type="submit"
              className="mt-2 sm:mt-0 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white font-bold tracking-wide hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
            >
              Find Rides
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 -mt-8">
        
        {/* Filter Bar */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider pl-2 pr-4 border-r border-gray-100 shrink-0">
              <Filter size={16} className="text-orange-500" /> District
            </div>
            {DISTRICTS.map((d) => {
              const active = district === d;
              return (
                <button
                  key={d}
                  onClick={() => setDistrict(d)}
                  className={`shrink-0 px-5 py-2 rounded-2xl text-sm font-bold transition-all ${
                    active
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="text-sm font-bold text-gray-400 px-2 shrink-0">
            {bikes.length} {bikes.length === 1 ? "Result" : "Results"}
          </div>
        </div>

        {/* Results */}
        <div className="mt-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-500 font-bold tracking-wide">Scanning available bikes...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">{error}</div>
          ) : bikes.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={40} className="text-orange-400"/>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-500 font-medium">We couldn't find any bikes matching your criteria. Try adjusting the search or district filter.</p>
              <button 
                onClick={() => { setSearch(""); setDistrict("All"); }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bikes.map((bike) => (
                <div
                  key={bike._id}
                  onClick={() => navigate(`/bikes/${bike._id}`)}
                  className="group bg-white rounded-[2rem] p-3 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-56 rounded-3xl bg-gray-100 overflow-hidden mb-4">
                    {bike.images?.length > 0 ? (
                      <img
                        src={bike.images[0]}
                        alt={bike.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🏍️</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md shadow-sm font-bold text-gray-900 text-sm">
                      {bike.cc}cc
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-3 pb-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-xl mb-3 tracking-tight group-hover:text-orange-600 transition-colors">
                        {bike.name}
                      </h3>

                      <div className="flex flex-col gap-2.5 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 w-max px-3 py-1.5 rounded-lg border border-gray-100">
                          <MapPin size={14} className="text-orange-500" /> {bike.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Per Day</div>
                        <div className="text-xl font-black text-gray-900">₹{bike.dailyRate}</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors">
                        <Maximize2 size={18} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BikeList;
