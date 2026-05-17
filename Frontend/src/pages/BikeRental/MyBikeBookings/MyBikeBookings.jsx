import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBikeBookings, cancelBikeBooking } from "../../../utils/api";
import {
  Bike,
  Calendar,
  MapPin,
  Clock,
  X,
  Loader,
  AlertCircle,
} from "lucide-react";
import PageContainer from "../../../components/PageContainer/PageContainer";

const MyBikeBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await getMyBikeBookings();
      setBookings(data.bookings);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setCancelling(bookingId);
    try {
      await cancelBikeBooking(bookingId);
      setBookings(
        bookings.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(null);
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
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-amber-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            My Bike Bookings
          </h1>
          <p className="text-gray-600 font-medium">
            View and manage your bike rentals
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-6">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <Bike size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Bookings Yet
            </h2>
            <p className="text-gray-500 mb-6">
              You haven't booked any bike rentals yet.
            </p>
            <button
              onClick={() => navigate("/bikes")}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Browse Bikes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Bike Image */}
                  {booking.bikeImage && (
                    <div className="md:w-48 h-48 md:h-auto bg-gray-100 shrink-0">
                      <img
                        src={booking.bikeImage}
                        alt={booking.bikeName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 p-6">
                    {/* Top Row */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.bikeName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.bikeCC}cc
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-sm ${getStatusColor(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-sm ${getPaymentColor(booking.paymentStatus)}`}
                        >
                          {booking.paymentStatus.charAt(0).toUpperCase() +
                            booking.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Start Date</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {formatDate(booking.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">End Date</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {formatDate(booking.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Duration</p>
                          <p className="font-medium text-gray-900 text-sm">
                            {booking.rentalDays} {booking.pricingType}(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {booking.pickupLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">Total Paid</p>
                        <p className="text-2xl font-black text-gray-900">
                          ₹{booking.totalAmount}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "upcoming" && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            disabled={cancelling === booking._id}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {cancelling === booking._id ? (
                              <Loader size={16} className="animate-spin" />
                            ) : (
                              <X size={16} />
                            )}
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() =>
                            navigate(`/bike-bookings/${booking._id}`)
                          }
                          className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default MyBikeBookings;
