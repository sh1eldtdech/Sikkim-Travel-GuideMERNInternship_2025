import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API, { createBikeOrder, verifyBikePayment } from "../../../utils/api";
import { useUserAuth } from "../../../context/UserAuthContext";
import { loadRazorpayScript, isRazorpayLoaded } from "../../../utils/razorpay";
import { ArrowLeft, MapPin, Phone, Check, Bike, Activity, Calendar, Clock, Loader, LogIn } from "lucide-react";
import PageContainer from "../../../components/PageContainer/PageContainer";

const Gallery = ({ images }) => {
  if (!images?.length)
    return (
      <div className="w-full aspect-video md:aspect-[4/3] rounded-3xl bg-gray-100 flex items-center justify-center text-6xl">
        🏍️
      </div>
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
  const location = useLocation();
  const { isAuthenticated } = useUserAuth();
  
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Booking state
  const [showBooking, setShowBooking] = useState(false);
  const [pricingType, setPricingType] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  
  // Format date for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Calculate pricing
  const calculatePrice = () => {
    if (!startDate || !endDate || !bike) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) return null;
    
    if (pricingType === "hourly") {
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      if (hours < 1) return null;
      const subtotal = bike.hourlyRate * hours;
      const taxes = Math.round(subtotal * 0.12);
      return { hours, subtotal, taxes, total: subtotal + taxes };
    } else {
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days < 1) return null;
      const subtotal = bike.dailyRate * days;
      const taxes = Math.round(subtotal * 0.12);
      return { days, subtotal, taxes, total: subtotal + taxes };
    }
  };
  
  const pricing = calculatePrice();
  
  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 16);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBike = async () => {
      try {
        const { data } = await API.get(`/bikes/${id}`);
        setBike(data.bike);
      } catch {
        setError("Bike not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const handleBookNowClick = () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      // Save booking details to localStorage for after login
      const bookingDetails = {
        bikeId: id,
        pricingType,
        startDate,
        endDate,
      };
      localStorage.setItem("pendingBikeBooking", JSON.stringify(bookingDetails));
      
      // Redirect to login with return URL
      navigate("/traveler-login", {
        state: { returnTo: `/bikes/${id}`, showBooking: true }
      });
      return;
    }
    
    // If logged in, show booking section
    setShowBooking(true);
  };

  // Check if there's a pending booking after login
  useEffect(() => {
    if (isAuthenticated && location.state?.showBooking) {
      const pendingBooking = localStorage.getItem("pendingBikeBooking");
      if (pendingBooking) {
        const details = JSON.parse(pendingBooking);
        if (details.bikeId === id) {
          setPricingType(details.pricingType || "daily");
          setStartDate(details.startDate || "");
          setEndDate(details.endDate || "");
          setShowBooking(true);
          localStorage.removeItem("pendingBikeBooking");
        }
      }
    }
  }, [isAuthenticated, location.state, id]);

  const handleBookNow = async () => {
    if (!startDate || !endDate) {
      setBookingError("Please select start and end time");
      return;
    }
    
    setBookingLoading(true);
    setBookingError("");

    try {
      // Ensure Razorpay is loaded
      if (!isRazorpayLoaded()) {
        await loadRazorpayScript();
      }

      // Create order
      const { data: orderData } = await createBikeOrder({
        bikeId: id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        pricingType,
      });

      // Open Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sikkim Travel Guide",
        description: `Bike Rental: ${bike.name}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId,
            };

            const { data: verifyDataResponse } = await verifyBikePayment(verifyData);
            
            navigate(`/bike-bookings/success/${orderData.bookingId}`, {
              state: { bookingRef: verifyDataResponse.bookingRef }
            });
          } catch (err) {
            setBookingError(err.response?.data?.message || "Payment verification failed");
            setBookingLoading(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#f97316",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      razorpay.on("payment.failed", (response) => {
        setBookingError(`Payment failed: ${response.error.description}`);
        setBookingLoading(false);
      });

    } catch (err) {
      setBookingError(err.response?.data?.message || "Failed to create booking");
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="page-shell min-h-screen bg-slate-50 pb-16 flex justify-center">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error || !bike)
    return (
      <div className="page-shell min-h-screen bg-slate-50 pb-16 flex flex-col items-center justify-center font-[Poppins]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <button onClick={() => navigate("/bikes")} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold">
          Back to Search
        </button>
      </div>
    );

  return (
    <PageContainer size="wide" bottom="normal">
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
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check size={20} className="text-emerald-500" /> Features Included
              </h3>
              {bike.features?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bike.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {f}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 font-medium">Standard features apply.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold mb-4 uppercase tracking-wide">
              <Activity size={14} /> Ready for Rental
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
              {bike.name}
            </h1>
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

            {/* Booking Section */}
            {!showBooking ? (
              <button
                onClick={handleBookNowClick}
                className="flex items-center justify-center w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors shadow-lg"
              >
                <Calendar size={20} className="mr-2" />
                Book Now
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPricingType("hourly");
                      setStartDate("");
                      setEndDate("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors ${
                      pricingType === "hourly"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Clock size={16} className="inline mr-1" /> Hourly
                  </button>
                  <button
                    onClick={() => {
                      setPricingType("daily");
                      setStartDate("");
                      setEndDate("");
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-colors ${
                      pricingType === "daily"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Calendar size={16} className="inline mr-1" /> Daily
                  </button>
                </div>

                {/* Selected Type Info */}
                

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {pricingType === "hourly" ? "Start Date & Time" : "Start Date"}
                    </label>
                    <input
                      type={pricingType === "hourly" ? "datetime-local" : "date"}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={getMinDate()}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{ colorScheme: "light" }}
                    />
                    {startDate && (
                      <p className="text-xs font-medium text-green-600 mt-1">
                        Selected: {formatDisplayDate(startDate)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {pricingType === "hourly" ? "End Date & Time" : "End Date"}
                    </label>
                    <input
                      type={pricingType === "hourly" ? "datetime-local" : "date"}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || getMinDate()}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{ colorScheme: "light" }}
                    />
                    {endDate && (
                      <p className="text-xs font-medium text-green-600 mt-1">
                        Selected: {formatDisplayDate(endDate)}
                      </p>
                    )}
                  </div>
                </div>

                {pricing && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rate</span>
                      <span className="font-bold text-gray-900">₹{pricingType === "hourly" ? bike.hourlyRate : bike.dailyRate} / {pricingType === "hourly" ? "hour" : "day"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{pricingType === "hourly" ? "Hours" : "Days"}</span>
                      <span className="font-bold text-gray-900">{pricingType === "hourly" ? pricing.hours : pricing.days}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold text-gray-900">₹{pricing.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GST (12%)</span>
                      <span className="font-bold text-gray-900">₹{pricing.taxes}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span className="text-gray-900">Total</span>
                      <span className="text-orange-600">₹{pricing.total}</span>
                    </div>
                  </div>
                )}

                {bookingError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                    {bookingError}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowBooking(false);
                      setBookingError("");
                    }}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookNow}
                    disabled={!pricing || bookingLoading}
                    className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader size={20} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Pay & Book"
                    )}
                  </button>
                </div>
              </div>
            )}

            {!showBooking && !isAuthenticated && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
                <LogIn size={18} className="text-amber-600" />
                <p className="text-sm font-medium text-amber-700">
                  Please login to book this bike
                </p>
              </div>
            )}

            {!showBooking && (
              <p className="text-center text-xs font-medium text-gray-400 mt-4">
                Connect directly with the owner to confirm availability.
              </p>
            )}
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
    </PageContainer>
  );
};

export default BikeDetails;