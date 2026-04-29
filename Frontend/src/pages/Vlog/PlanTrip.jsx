import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Heart,
  Trash2,
  Plus,
  Minus,
  Star,
  Clock,
  Users,
  DollarSign,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import "./PlanTrip.css";

const PlanTrip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [selectedDates, setSelectedDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(50000);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [tripDuration, setTripDuration] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Load wishlist from props or localStorage
  useEffect(() => {
    const initialWishlist =
      location.state?.wishlist ||
      JSON.parse(sessionStorage.getItem("travelWishlist") || "[]");
    setWishlist(initialWishlist);
  }, [location.state]);

  // Calculate trip duration
  useEffect(() => {
    if (selectedDates.startDate && selectedDates.endDate) {
      const start = new Date(selectedDates.startDate);
      const end = new Date(selectedDates.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTripDuration(diffDays);
    }
  }, [selectedDates]);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(updatedWishlist);
    sessionStorage.setItem("travelWishlist", JSON.stringify(updatedWishlist));
  };

  const toggleDestinationSelection = (destination) => {
    setSelectedDestinations((prev) => {
      const isSelected = prev.find((d) => d.id === destination.id);
      if (isSelected) {
        return prev.filter((d) => d.id !== destination.id);
      } else {
        return [...prev, destination];
      }
    });
  };

  const handleDateChange = (type, value) => {
    setSelectedDates((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const calculateEstimatedCost = () => {
    const baseCostPerPerson = 3000;
    const destinationCost = selectedDestinations.length * 2000;
    const durationMultiplier = tripDuration > 0 ? tripDuration : 1;
    return (
      (baseCostPerPerson + destinationCost) * travelers * durationMultiplier
    );
  };

  const handlePlanTrip = () => {
    if (selectedDestinations.length === 0) {
      alert("Please select at least one destination for your trip!");
      return;
    }
    if (!selectedDates.startDate || !selectedDates.endDate) {
      alert("Please select your travel dates!");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    // Here you would typically send data to your backend
    alert(
      "Trip planned successfully! You will receive a confirmation email shortly.",
    );
    setShowConfirmation(false);
    navigate("/vlog");
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="plan-trip-container">
      {/* Header */}
      <div className="plan-trip-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft className="back-icon" />
          Back to Vlogs
        </button>
        <div className="header-content">
          <h1 className="page-title">Plan Your Sikkim Adventure</h1>
          <p className="page-subtitle">
            Create your perfect itinerary from your wishlist destinations
          </p>
        </div>
      </div>

      <div className="plan-trip-content">
        {/* Trip Planning Form */}
        <div className="planning-section">
          <div className="form-card">
            <h2 className="section-title">Trip Details</h2>

            {/* Date Selection */}
            <div className="form-group">
              <label className="form-label">
                <Calendar className="form-icon" />
                Travel Dates
              </label>
              <div className="date-inputs">
                <div className="date-input-group">
                  <label className="date-label">Start Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={selectedDates.startDate}
                    min={getTodayDate()}
                    onChange={(e) =>
                      handleDateChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div className="date-input-group">
                  <label className="date-label">End Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={selectedDates.endDate}
                    min={selectedDates.startDate || getTodayDate()}
                    onChange={(e) =>
                      handleDateChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>
              {tripDuration > 0 && (
                <div className="trip-duration">
                  <Clock className="duration-icon" />
                  <span>
                    {tripDuration} day{tripDuration > 1 ? "s" : ""} trip
                  </span>
                </div>
              )}
            </div>

            {/* Travelers */}
            <div className="form-group">
              <label className="form-label">
                <Users className="form-icon" />
                Number of Travelers
              </label>
              <div className="travelers-selector">
                <button
                  className="travelers-btn"
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                >
                  <Minus className="btn-icon" />
                </button>
                <span className="travelers-count">{travelers}</span>
                <button
                  className="travelers-btn"
                  onClick={() => setTravelers(travelers + 1)}
                >
                  <Plus className="btn-icon" />
                </button>
              </div>
            </div>

            {/* Budget */}
            <div className="form-group">
              <label className="form-label">
                <DollarSign className="form-icon" />
                Budget (INR)
              </label>
              <input
                type="range"
                className="budget-slider"
                min="20000"
                max="200000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
              />
              <div className="budget-display">
                ₹{budget.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="cost-card">
            <h3 className="cost-title">Estimated Cost</h3>
            <div className="cost-breakdown">
              <div className="cost-item">
                <span>Base cost per person</span>
                <span>₹3,000</span>
              </div>
              <div className="cost-item">
                <span>
                  Selected destinations ({selectedDestinations.length})
                </span>
                <span>
                  ₹
                  {(selectedDestinations.length * 2000).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="cost-item">
                <span>Duration ({tripDuration} days)</span>
                <span>×{tripDuration > 0 ? tripDuration : 1}</span>
              </div>
              <div className="cost-item">
                <span>Travelers ({travelers})</span>
                <span>×{travelers}</span>
              </div>
              <div className="cost-total">
                <span>Total Estimated Cost</span>
                <span>₹{calculateEstimatedCost().toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Destinations */}
        <div className="wishlist-section">
          <h2 className="section-title">
            Your Wishlist Destinations
            <span className="destination-count">({wishlist.length})</span>
          </h2>

          {wishlist.length === 0 ? (
            <div className="empty-wishlist">
              <Heart className="empty-icon" />
              <h3>No destinations in your wishlist</h3>
              <p>
                Go back to vlogs and add some destinations to your wishlist!
              </p>
              <button className="browse-button" onClick={() => navigate("/")}>
                Browse Destinations
              </button>
            </div>
          ) : (
            <div className="destinations-grid">
              {wishlist.map((destination) => (
                <div key={destination.id} className="destination-card">
                  <div className="destination-image">
                    <img src={destination.thumbnail} alt={destination.title} />
                    <button
                      className="remove-btn"
                      onClick={() => removeFromWishlist(destination.id)}
                      title="Remove from wishlist"
                    >
                      <Trash2 className="remove-icon" />
                    </button>
                  </div>

                  <div className="destination-content">
                    <h3 className="destination-title">{destination.title}</h3>
                    <div className="destination-location">
                      <MapPin className="location-icon" />
                      <span>{destination.location}</span>
                    </div>

                    <p className="destination-description">
                      {destination.description}
                    </p>

                    <div className="destination-rating">
                      <Star className="star-icon" />
                      <span>{destination.rating}</span>
                    </div>

                    <div className="destination-tags">
                      {destination.tags.map((tag, index) => (
                        <span key={index} className="destination-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      className={`select-btn ${
                        selectedDestinations.find(
                          (d) => d.id === destination.id,
                        )
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => toggleDestinationSelection(destination)}
                    >
                      {selectedDestinations.find(
                        (d) => d.id === destination.id,
                      ) ? (
                        <>
                          <Check className="btn-icon" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Plus className="btn-icon" />
                          Add to Trip
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plan Trip Button */}
        {wishlist.length > 0 && (
          <div className="plan-button-section">
            <button
              className="plan-trip-btn"
              onClick={handlePlanTrip}
              disabled={selectedDestinations.length === 0}
            >
              Plan My Trip
              {selectedDestinations.length > 0 && (
                <span className="selected-count">
                  ({selectedDestinations.length})
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Your Trip</h3>
              <button
                className="modal-close"
                onClick={() => setShowConfirmation(false)}
              >
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-content">
              <div className="trip-summary">
                <h4>Trip Summary</h4>
                <div className="summary-item">
                  <span>Destinations:</span>
                  <span>{selectedDestinations.length}</span>
                </div>
                <div className="summary-item">
                  <span>Duration:</span>
                  <span>{tripDuration} days</span>
                </div>
                <div className="summary-item">
                  <span>Travelers:</span>
                  <span>{travelers}</span>
                </div>
                <div className="summary-item">
                  <span>Dates:</span>
                  <span>
                    {new Date(selectedDates.startDate).toLocaleDateString()} -
                    {new Date(selectedDates.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="summary-total">
                  <span>Total Cost:</span>
                  <span>
                    ₹{calculateEstimatedCost().toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="selected-destinations">
                <h4>Selected Destinations</h4>
                <div className="selected-list">
                  {selectedDestinations.map((dest) => (
                    <div key={dest.id} className="selected-item">
                      <img src={dest.thumbnail} alt={dest.title} />
                      <div>
                        <h5>{dest.title}</h5>
                        <p>{dest.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTrip;
