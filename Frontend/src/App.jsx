
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Headers from "./components/Headers/Headers";
import Footers from "./components/Footers/Footers";

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

function App() {
  return (
    <Router>
      <div className="app">
        <Headers />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
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
          </Routes>
        </Suspense>
        <Footers />
      </div>
    </Router>
  );
}

export default App;