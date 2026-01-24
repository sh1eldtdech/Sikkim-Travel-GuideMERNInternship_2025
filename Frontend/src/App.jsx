import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Headers from "./components/Headers/Headers";
import Footers from "./components/Footers/Footers";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import AboutUs from "./pages/About Us/AboutUs";
import Places from "./pages/Travel/Places";
import EastSikkim from "./pages/Travel/EastSikkim";
import NorthSikkim from "./pages/Travel/NorthSikkim";
import WestSikkim from "./pages/Travel/WestSikkim";
import SouthSikkim from "./pages/Travel/SouthSikkim";
import Adventure from "./pages/Adventure Zone/Adventure"
import Vlog from "./pages/Vlog/Vlog";
import PlanTravel from "./pages/Vlog/PlanTrip";
import ContactUs from "./pages/Contact Us/ContactUs";
import Login from "./pages/Login/Login";
import Traveler from "./pages/Login/Traveler";
import Government from "./pages/Login/Government";
import Business from "./pages/Login/Business"
import DisasterAlert from "./pages/Disaster/DisasterAlert";
import SikkimTourDashboard from "./pages/Login/Dashboard/Dashboard";
import Article from "./pages/Vlog/Article";

function App() {
  return (
    <Router>
      <div className="app">
        <Headers />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/aboutus" element={<AboutUs />} />
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
        </Routes>
        <Footers />
      </div>
    </Router>
  );
}

export default App;