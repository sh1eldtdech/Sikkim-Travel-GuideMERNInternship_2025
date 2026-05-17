import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBikeBookingById } from "../../../utils/api";
import { CheckCircle, Calendar, MapPin, Bike, Phone, ArrowLeft, Loader } from "lucide-react";
import PageContainer from "../../../components/PageContainer/PageContainer";

const BikeBookingSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await getBikeBookingById(id);
        setBooking(data.booking);
      } catch (err) {
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="page-shell min-h-screen bg-slate-50 pb-16 flex justify-center items-center">
        <Loader size={40} className="text-orange-500 animate-spin" />
      </div>
    );

  if (error || !booking)
    return (
      <PageContainer>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "Booking not found"}</h2>
          <button
            onClick={() => navigate("/bikes")}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold"
          >
            Back to Bikes
          </button>
        </div>
      </PageContainer>
    );

  return (
    <PageContainer size="narrow">
      <div className="py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 font-medium">
            Your bike rental has been successfully booked.
          </p>
          <div className="inline-block mt-4 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold">
            Ref: {booking._id.slice(-8).toUpperCase()}
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Bike Image Banner */}
          {booking.bikeImage && (
            <div className="h-32 bg-gray-100">
              <img
                src={booking.bikeImage}
                alt={booking.bikeName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Bike Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                  <Bike size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{booking.bikeName}</h2>
                  <p className="text-sm text-gray-500">{booking.bikeCC}cc</p>
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rental Period</p>
                <p className="font-bold text-gray-900">
                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                </p>
                <p className="text-sm text-gray-500">
                  {booking.rentalDays} {booking.pricingType}(s)
                </p>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-500 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup Location</p>
                <p className="font-bold text-gray-900">{booking.pickupLocation}</p>
              </div>
            </div>

            {/* Owner Contact */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Owner Contact</p>
                <p className="font-bold text-gray-900">{booking.ownerName}</p>
                <p className="text-sm text-gray-500">{booking.ownerContact}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-bold text-gray-900 mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate ({booking.pricingType})</span>
                  <span className="font-medium">₹{booking.pricingType === "hourly" ? booking.hourlyRate : booking.dailyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{booking.rentalDays} {booking.pricingType}(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{booking.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (12%)</span>
                  <span className="font-medium">₹{booking.taxes}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Paid</span>
                  <span className="text-green-600">₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-center">
              <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                booking.status === "confirmed" || booking.status === "upcoming"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/my-bike-bookings")}
            className="flex-1 py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/bikes")}
            className="flex-1 py-4 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} /> Browse More Bikes
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default BikeBookingSuccess;