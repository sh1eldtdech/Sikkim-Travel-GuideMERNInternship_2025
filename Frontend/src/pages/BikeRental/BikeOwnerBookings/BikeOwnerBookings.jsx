import React, { useEffect, useState } from "react";
import { getBikeOwnerBookings, updateBikeBookingStatus } from "../../../utils/api";
import { Bike, Calendar, MapPin, Clock, Loader, DollarSign, Users, Check, X, RotateCcw } from "lucide-react";
import PageContainer from "../../../components/PageContainer/PageContainer";

const BikeOwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      console.log("Fetching bike owner bookings...");
      const { data } = await getBikeOwnerBookings();
      console.log("Bookings fetched:", data);
      setBookings(data.bookings);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      console.error("Error response:", err.response);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus === "active" ? "mark as active" : newStatus === "completed" ? "mark as completed" : "cancel"} this booking?`)) {
      return;
    }
    
    setUpdating(bookingId);
    try {
      const response = await updateBikeBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b =>
        b._id === bookingId ? { ...b, status: newStatus } : b
      ));
      // Refresh stats
      fetchBookings();
      alert(response.data?.message || `Booking marked as ${newStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update status";
      alert("Error: " + errorMessage);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-700";
      case "active": return "bg-green-100 text-green-700";
      case "completed": return "bg-gray-100 text-gray-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading)
    return (
      <div className="page-shell min-h-screen bg-slate-50 pb-16 flex justify-center items-center">
        <Loader size={40} className="text-orange-500 animate-spin" />
      </div>
    );

  return (
    <PageContainer size="wide" bottom="normal">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Bike Rental Bookings</h1>
          <p className="text-gray-600 font-medium">Manage your bike rental bookings</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                  <Bike size={20} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats.totalBookings}</p>
              <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-500 flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">₹{stats.totalRevenue?.toLocaleString()}</p>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats.confirmed}</p>
              <p className="text-sm text-gray-500 font-medium">Upcoming</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500 font-medium">Active</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
                  <Check size={20} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats.completed}</p>
              <p className="text-sm text-gray-500 font-medium">Completed</p>
            </div>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <Bike size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
            <p className="text-gray-500">Your bikes haven't been booked yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  {/* Top Row */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      {booking.bikeImage && (
                        <img src={booking.bikeImage} alt={booking.bikeName} className="w-16 h-16 rounded-xl object-cover" />
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{booking.bikeName}</h3>
                        <p className="text-sm text-gray-500">{booking.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full font-bold text-sm ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-400">Customer</p>
                      <p className="font-medium text-gray-900">{booking.user?.name || "N/A"}</p>
                      <p className="text-gray-500 text-xs">{booking.user?.phone || booking.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Rental Period</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </p>
                      <p className="text-gray-500 text-xs">{booking.rentalDays} {booking.pricingType}(s)</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="font-bold text-lg text-gray-900">₹{booking.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Payment</p>
                      <p className={`font-medium ${booking.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </p>
                    </div>
                  </div>

                  {/* Status Actions */}
                  {booking.status !== "completed" && booking.status !== "cancelled" && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.status === "upcoming" && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, "active")}
                            disabled={updating === booking._id}
                            className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 font-medium text-sm hover:bg-green-200 disabled:opacity-50 flex items-center gap-1"
                          >
                            <Check size={14} /> Mark Active
                          </button>
                        )}
                        {booking.status === "active" && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, "completed")}
                            disabled={updating === booking._id}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1"
                          >
                            <Check size={14} /> Mark Completed
                          </button>
                        )}
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => handleStatusUpdate(booking._id, "cancelled")}
                            disabled={updating === booking._id}
                            className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 font-medium text-sm hover:bg-red-200 disabled:opacity-50 flex items-center gap-1"
                          >
                            <X size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default BikeOwnerBookings;