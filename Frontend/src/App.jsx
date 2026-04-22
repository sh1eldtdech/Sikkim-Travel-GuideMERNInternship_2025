
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Headers from "./components/Headers/Headers";
import Footers from "./components/Footers/Footers";
import { useOwnerAuth } from "./context/OwnerAuthContext";
import { useBikeOwnerAuth } from "./context/BikeOwnerAuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Existing pages
const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Places = lazy(() => import("./pages/Travel/Places"));
const EastSikkim = lazy(() => import("./pages/Travel/EastSikkim"));
const NorthSikkim = lazy(() => import("./pages/Travel/NorthSikkim"));
const WestSikkim = lazy(() => import("./pages/Travel/WestSikkim"));
const SouthSikkim = lazy(() => import("./pages/Travel/SouthSikkim"));
const Adventure = lazy(() => import("./pages/Adventure Zone/Adventure"));
const Vlog = lazy(() => import("./pages/Vlog/Vlog"));
const PlanTravel = lazy(() => import("./pages/Vlog/PlanTrip"));
const ContactUs = lazy(() => import("./pages/Contact Us/ContactUs"));
const Login = lazy(() => import("./pages/Login/Login"));
const Traveler = lazy(() => import("./pages/Login/Traveler"));
const Government = lazy(() => import("./pages/Login/Government"));
const Business = lazy(() => import("./pages/Login/Business"));
const DisasterAlert = lazy(() => import("./pages/Disaster/DisasterAlert"));
const SikkimTourDashboard = lazy(() => import("./pages/Login/Dashboard/Dashboard"));
const Article = lazy(() => import("./pages/Vlog/Article"));

// Hotel Owner pages
const OwnerLogin = lazy(() => import("./pages/Login/OwnerLogin/OwnerLogin"));
const OwnerDashboard = lazy(() => import("./pages/HotelOwner/Dashboard/OwnerDashboard"));
const AddHotel = lazy(() => import("./pages/HotelOwner/AddHotel/AddHotel"));
const MyHotels = lazy(() => import("./pages/HotelOwner/MyHotels/MyHotels"));
const OwnerBookings = lazy(() => import("./pages/HotelOwner/Bookings/OwnerBookings"));

// Tourist Hotel pages
const HotelList = lazy(() => import("./pages/Login/Hotels/HotelList/HotelList"));
const HotelDetails = lazy(() => import("./pages/Login/Hotels/HotelDetails/HotelDetails"));
const BookingPage = lazy(() => import("./pages/Login/Hotels/BookingPage/BookingPage"));

// Admin — unified dashboard covering all business entities
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));

// Bike Rental — Owner pages
const BikeRentalDashboard = lazy(() => import("./pages/BikeRental/Dashboard/BikeRentalDashboard"));
const AddBike = lazy(() => import("./pages/BikeRental/AddBike/AddBike"));
const MyBikes = lazy(() => import("./pages/BikeRental/MyBikes/MyBikes"));
const BikeBookings = lazy(() => import("./pages/BikeRental/BikeBookings/BikeBookings"));

// Bike Rental — Public pages
const BikeList = lazy(() => import("./pages/BikeRental/BikeList/BikeList"));
const BikeDetails = lazy(() => import("./pages/BikeRental/BikeDetails/BikeDetails"));

// Protected route wrapper for Hotel Owner pages (uses ownerToken)
const OwnerRoute = ({ children }) => {
  const { isAuthenticated } = useOwnerAuth();
  // Also check localStorage directly — covers the race condition where
  // navigate() fires before React state from login() has propagated
  const hasToken = isAuthenticated || !!localStorage.getItem("ownerToken");
  return hasToken ? children : <Navigate to="/owner-login" replace />;
};

// Protected route wrapper for Bike Rental Owner pages (uses bikeOwnerToken — separate entity)
const BikeOwnerRoute = ({ children }) => {
  const { isAuthenticated } = useBikeOwnerAuth();
  const hasToken = isAuthenticated || !!localStorage.getItem("bikeOwnerToken");
  return hasToken ? children : <Navigate to="/owner-login" replace />;
};


function AppContent() {
  const { pathname } = useLocation();
  // Hide site header/footer on the admin dashboard (it has its own layout)
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="app">
      <ToastContainer position="top-right" autoClose={3000} />
      {!isAdmin && <Headers />}
      <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>Loading...</div>}>
        <Routes>
          {/* Existing routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/places" element={<Places />} />
          <Route path="/north-sikkim" element={<NorthSikkim />} />
          <Route path="/east-sikkim" element={<EastSikkim />} />
          <Route path="/west-sikkim" element={<WestSikkim />} />
          <Route path="/south-sikkim" element={<SouthSikkim />} />
          <Route path="/adventure-zone" element={<Adventure />} />
          <Route path="/vlog" element={<Vlog />} />
          <Route path="/plan-trip" element={<PlanTravel />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/traveler-login" element={<Traveler />} />
          <Route path="/government-login" element={<Government />} />
          <Route path="/business-login" element={<Business />} />
          <Route path="/disaster-alerts" element={<DisasterAlert />} />
          <Route path="/government-dashboard" element={<SikkimTourDashboard />} />
          <Route path="/article" element={<Article />} />

          {/* Tourist Hotel routes */}
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/booking/:hotelId" element={<BookingPage />} />

          {/* Business Owner routes */}
          <Route path="/owner-login" element={<OwnerLogin />} />
          {/* Legacy fallback → redirect to hotel dashboard */}
          <Route path="/owner/dashboard" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
          {/* Business-specific dashboard routes */}
          <Route path="/owner/hotel/dashboard" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
          <Route path="/owner/add-hotel" element={<OwnerRoute><AddHotel /></OwnerRoute>} />
          <Route path="/owner/my-hotels" element={<OwnerRoute><MyHotels /></OwnerRoute>} />
          <Route path="/owner/bookings" element={<OwnerRoute><OwnerBookings /></OwnerRoute>} />

          {/* Admin — unified dashboard: /admin covers Hotels, Bikes, and any future business */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Legacy redirect — old bookmark /admin/hotels → /admin */}
          <Route path="/admin/hotels" element={<Navigate to="/admin" replace />} />

          {/* Public Bike Rental routes */}
          <Route path="/bikes" element={<BikeList />} />
          <Route path="/bikes/:id" element={<BikeDetails />} />

          {/* Owner Bike Rental routes (protected by BikeOwnerRoute — separate from OwnerRoute) */}
          <Route path="/owner/bike-rental/dashboard" element={<BikeOwnerRoute><BikeRentalDashboard /></BikeOwnerRoute>} />
          <Route path="/owner/bike-rental/add-bike" element={<BikeOwnerRoute><AddBike /></BikeOwnerRoute>} />
          <Route path="/owner/bike-rental/my-bikes" element={<BikeOwnerRoute><MyBikes /></BikeOwnerRoute>} />
          <Route path="/owner/bike-rental/bookings" element={<BikeOwnerRoute><BikeBookings /></BikeOwnerRoute>} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footers />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;