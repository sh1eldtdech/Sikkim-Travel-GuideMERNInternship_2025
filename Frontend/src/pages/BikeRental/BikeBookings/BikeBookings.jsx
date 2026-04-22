import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";

const BikeBookings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/owner/bike-rental/dashboard")}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bike Bookings</h1>
            <p className="text-sm font-medium text-gray-500">Manage customer reservations</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-10 sm:p-14 shadow-sm border border-gray-100 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <ClipboardList size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Integration Pending</h2>
          <p className="text-gray-500 font-medium max-w-lg mb-8 leading-relaxed">
            Direct online booking (Razorpay integration) for bike rentals is currently under development. For now, customers will view your listings and call you directly via your provided contact number to establish reservations.
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-8 w-full max-w-md text-sm text-gray-700 font-medium">
            Keep your contact number up-to-date in your listings to ensure customers can reach you!
          </div>

          <button
            onClick={() => navigate("/owner/bike-rental/my-bikes")}
            className="px-8 py-3.5 rounded-xl bg-orange-500 text-white font-bold shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors"
          >
            Go to My Listings
          </button>
        </div>

      </div>
    </div>
  );
};

export default BikeBookings;
