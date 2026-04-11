import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchHotels } from "../api";
import "./HotelList.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const districts = ["All", "East", "West", "North", "South"];

// Resolve image src — handle local uploads or full URLs
const resolveImage = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [searchQuery, setSearchQuery] = useState("");

  const loadHotels = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (selectedDistrict !== "All") params.district = selectedDistrict;
      if (maxPrice < 20000) params.maxPrice = maxPrice;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await fetchHotels(params);
      setHotels(data.hotels || []);
    } catch (err) {
      setError("Failed to load hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict, maxPrice, searchQuery]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(loadHotels, 400);
    return () => clearTimeout(timer);
  }, [loadHotels]);

  return (
    <div className="hotel-list-page">
      {/* Hero Banner */}
      <div className="hl-hero">
        <div className="hl-hero-overlay" />
        <div className="hl-hero-content">
          <span className="hl-hero-tag">Sikkim Tourism</span>
          <h1 className="hl-hero-title">Find Your Mountain Stay</h1>
          <p className="hl-hero-sub">
            Curated accommodations across all four districts of Sikkim
          </p>
          <div className="hl-search-bar">
            <span className="hl-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search hotels or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="hl-body">
        {/* Filters Sidebar */}
        <aside className="hl-filters">
          <h3 className="hl-filter-title">Filter</h3>

          <div className="hl-filter-group">
            <label>District</label>
            <div className="hl-district-chips">
              {districts.map((d) => (
                <button
                  key={d}
                  className={`hl-chip ${selectedDistrict === d ? "active" : ""}`}
                  onClick={() => setSelectedDistrict(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="hl-filter-group">
            <label>Max Price: ₹{maxPrice.toLocaleString()}/night</label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="hl-range"
            />
            <div className="hl-range-labels">
              <span>₹1,000</span>
              <span>₹20,000</span>
            </div>
          </div>

          <div className="hl-filter-summary">
            <span>{hotels.length} hotel{hotels.length !== 1 ? "s" : ""} found</span>
          </div>
        </aside>

        {/* Hotel Grid */}
        <main className="hl-grid-area">
          {loading ? (
            <div className="hl-loading">
              <div className="hl-spinner" />
              <p>Finding hotels...</p>
            </div>
          ) : error ? (
            <div className="hl-empty">
              <span>⚠️</span>
              <p>{error}</p>
              <button className="hl-retry-btn" onClick={loadHotels}>Retry</button>
            </div>
          ) : hotels.length === 0 ? (
            <div className="hl-empty">
              <span>🏔️</span>
              <p>No hotels match your filters.</p>
            </div>
          ) : (
            <div className="hl-grid">
              {hotels.map((hotel) => (
                <Link
                  to={`/hotel/${hotel._id}`}
                  className="hl-card"
                  key={hotel._id}
                >
                  <div className="hl-card-img-wrap">
                    <div className="hl-image-gallery">
                      {hotel.images && hotel.images.length > 0 ? (
                        hotel.images.slice(0, 6).map((img, idx) => (
                           <img
                             key={idx}
                             src={resolveImage(img)}
                             alt={`${hotel.name} - ${idx + 1}`}
                             onError={(e) => {
                               e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";
                             }}
                             className="hl-gallery-img"
                           />
                        ))
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                          alt={hotel.name}
                          className="hl-gallery-img"
                        />
                      )}
                    </div>
                    <span className="hl-badge">{hotel.district} Sikkim</span>
                    <div className="hl-card-overlay" />
                  </div>
                  <div className="hl-card-body">
                    <div className="hl-card-top">
                      <h3>{hotel.name}</h3>
                      {hotel.rating > 0 && (
                        <span className="hl-rating">
                          ⭐ {hotel.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="hl-location">📍 {hotel.location}</p>
                    <p className="hl-desc">{hotel.description}</p>
                    <div className="hl-card-footer">
                      <div className="hl-price">
                        {hotel.startingPrice > 0 ? (
                          <>
                            <span className="hl-price-from">from</span>
                            <span className="hl-price-val">
                              ₹{hotel.startingPrice.toLocaleString()} {hotel.highestPrice > hotel.startingPrice ? `- ₹${hotel.highestPrice.toLocaleString()}` : ''}
                            </span>
                            <span className="hl-price-night">/night</span>
                          </>
                        ) : (
                          <span className="hl-price-from">Contact for pricing</span>
                        )}
                      </div>
                      <button className="hl-btn">View Hotel →</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
