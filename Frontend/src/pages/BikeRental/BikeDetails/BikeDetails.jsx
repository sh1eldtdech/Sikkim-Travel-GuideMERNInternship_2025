import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../utils/api";
import { ArrowLeft, MapPin, Phone, Check, Bike, Activity } from "lucide-react";

const Gallery = ({ images }) => {
  if (!images?.length) return (
    <div className="w-full aspect-video md:aspect-[4/3] rounded-3xl bg-gray-100 flex items-center justify-center text-6xl">🏍️</div>
  );
  return (
    <div className="space-y-4">
      <div className="w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
        <img src={images[0]} alt="primary" className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.slice(1, 4).map((img, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const { data } = await API.get(`/bikes/${id}`);
        setBike(data.bike);
      } catch (err) {
        setError("Bike not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 flex justify-center">
      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  if (error || !bike) return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 flex flex-col items-center justify-center font-[Poppins]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
      <button onClick={() => navigate("/bikes")} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold">Back to Search</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top nav */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/bikes")}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 truncate">Bike Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column - Gallery & Description */}
          <div className="lg:col-span-7 space-y-8">
            <Gallery images={bike.images} />
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Bike</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                {bike.description || "No description provided."}
              </p>
              
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Check size={20} className="text-emerald-500" /> Features Included</h3>
                {bike.features?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bike.features.map(f => (
                      <div key={f} className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {f}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400 font-medium">Standard features apply.</p>}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-4 uppercase tracking-wide">
                <Activity size={14} /> Ready for Rental
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">{bike.name}</h1>
              <p className="text-gray-500 font-bold mb-6">{bike.cc}cc Engine</p>

              <div className="flex flex-col gap-3 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  {bike.location}
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  {bike.contactNumber}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-4">Rental Rates</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                  <div className="text-2xl font-black text-gray-900">₹{bike.hourlyRate}</div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Per Hour</div>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
                  <div className="text-2xl font-black text-orange-600">₹{bike.dailyRate}</div>
                  <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mt-1">Per Day</div>
                </div>
              </div>

              <a
                href={`tel:${bike.contactNumber}`}
                className="flex items-center justify-center w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors shadow-lg"
              >
                Call to Book Now
              </a>
              <p className="text-center text-xs font-medium text-gray-400 mt-4">Connect directly with the owner to confirm availability.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold">
                {bike.owner?.name?.charAt(0) || "B"}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Listed By</div>
                <div className="font-bold text-gray-900">{bike.owner?.name || "Local Operator"}</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BikeDetails;
