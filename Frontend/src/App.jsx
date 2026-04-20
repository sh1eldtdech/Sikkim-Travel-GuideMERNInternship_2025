
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Headers from "./components/Headers/Headers";
import Footers from "./components/Footers/Footers";
import { useOwnerAuth } from "./context/OwnerAuthContext";
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

// Admin pages
const AdminHotels = lazy(() => import("./pages/Admin/AdminHotels"));

// Protected route wrapper for Hotel Owner pages
const OwnerRoute = ({ children }) => {
  const { isAuthenticated } = useOwnerAuth();
  return isAuthenticated ? children : <Navigate to="/owner-login" replace />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <ToastContainer position="top-right" autoClose={3000} />
        <Headers />
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

            {/* Hotel Owner routes */}
            <Route path="/owner-login" element={<OwnerLogin />} />
            <Route path="/owner/dashboard" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
            <Route path="/owner/add-hotel" element={<OwnerRoute><AddHotel /></OwnerRoute>} />
            <Route path="/owner/my-hotels" element={<OwnerRoute><MyHotels /></OwnerRoute>} />
            <Route path="/owner/bookings" element={<OwnerRoute><OwnerBookings /></OwnerRoute>} />
            
            {/* Admin routes */}
            <Route path="/admin/hotels" element={<AdminHotels />} />
          </Routes>
        </Suspense>
        <Footers />
      </div>
    </Router>
  );
}

export default App;