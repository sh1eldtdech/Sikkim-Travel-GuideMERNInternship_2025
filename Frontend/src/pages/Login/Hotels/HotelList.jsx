import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HotelList.css";

const sampleHotels = [
  {
    _id: "1",
    name: "The Elgin Nor-Khill",
    district: "East",
    location: "Gangtok",
    description: "A heritage hotel with stunning views of Kanchenjunga, offering luxurious rooms and traditional Sikkimese architecture in the heart of Gangtok.",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"],
    rating: 4.8,
    startingPrice: 4500,
    rooms: [{ roomType: "Deluxe", availableRooms: 3 }],
  },
  {
    _id: "2",
    name: "Mayfair Spa Resort",
    district: "East",
    location: "Gangtok",
    description: "Premium resort with world-class spa, pool, and panoramic Himalayan views. Perfect for a rejuvenating mountain retreat.",
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600"],
    rating: 4.6,
    startingPrice: 6200,
    rooms: [{ roomType: "Suite", availableRooms: 2 }],
  },
  {
    _id: "3",
    name: "Nathula Heritage Inn",
    district: "East",
    location: "Tsomgo",
    description: "Cozy mountain inn near Nathula Pass, offering warm hospitality and breathtaking views of alpine lakes and snow peaks.",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"],
    rating: 4.3,
    startingPrice: 2800,
    rooms: [{ roomType: "Standard", availableRooms: 5 }],
  },
  {
    _id: "4",
    name: "Pelling Himalayan View",
    district: "West",
    location: "Pelling",
    description: "Perched above Pelling with direct views of Kanchenjunga and Rimbi waterfall. Ideal for trekkers and nature lovers.",
    images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600"],
    rating: 4.5,
    startingPrice: 3200,
    rooms: [{ roomType: "Deluxe", availableRooms: 4 }],
  },
  {
    _id: "5",
    name: "Ravangla Buddhist Retreat",
    district: "South",
    location: "Ravangla",
    description: "Peaceful retreat near Buddha Park, offering meditation spaces, organic meals, and serene forest surroundings.",
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"],
    rating: 4.4,
    startingPrice: 2200,
    rooms: [{ roomType: "Standard", availableRooms: 6 }],
  },
  {
    _id: "6",
    name: "Lachen Alpine Lodge",
    district: "North",
    location: "Lachen",
    description: "Remote alpine lodge at 2750m altitude, gateway to Gurudongmar Lake. Experience the raw beauty of North Sikkim.",
    images: ["https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=600"],
    rating: 4.7,
    startingPrice: 3800,
    rooms: [{ roomType: "Deluxe", availableRooms: 2 }],
  },
];

const districts = ["All", "East", "West", "North", "South"];

export default function HotelList() {
  const [hotels, setHotels] = useState(sampleHotels);
  const [filtered, setFiltered] = useState(sampleHotels);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let result = hotels;
    if (selectedDistrict !== "All") {
      result = result.filter((h) => h.district === selectedDistrict);
    }
    if (maxPrice < 10000) {
      result = result.filter((h) => h.startingPrice <= maxPrice);
    }
    if (searchQuery) {
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFiltered(result);
  }, [selectedDistrict, maxPrice, searchQuery, hotels]);

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
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="hl-range"
            />
            <div className="hl-range-labels">
              <span>₹1,000</span>
              <span>₹10,000</span>
            </div>
          </div>

          <div className="hl-filter-summary">
            <span>{filtered.length} hotels found</span>
          </div>
        </aside>

        {/* Hotel Grid */}
        <main className="hl-grid-area">
          {filtered.length === 0 ? (
            <div className="hl-empty">
              <span>🏔️</span>
              <p>No hotels match your filters.</p>
            </div>
          ) : (
            <div className="hl-grid">
              {filtered.map((hotel) => (
                <Link
                  to={`/hotel/${hotel._id}`}
                  className="hl-card"
                  key={hotel._id}
                >
                  <div className="hl-card-img-wrap">
                    <img src={hotel.images[0]} alt={hotel.name} />
                    <span className="hl-badge">{hotel.district} Sikkim</span>
                    <div className="hl-card-overlay" />
                  </div>
                  <div className="hl-card-body">
                    <div className="hl-card-top">
                      <h3>{hotel.name}</h3>
                      <span className="hl-rating">⭐ {hotel.rating}</span>
                    </div>
                    <p className="hl-location">📍 {hotel.location}</p>
                    <p className="hl-desc">{hotel.description}</p>
                    <div className="hl-card-footer">
                      <div className="hl-price">
                        <span className="hl-price-from">from</span>
                        <span className="hl-price-val">
                          ₹{hotel.startingPrice.toLocaleString()}
                        </span>
                        <span className="hl-price-night">/night</span>
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
