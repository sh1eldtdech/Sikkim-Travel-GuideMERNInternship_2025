import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHotelById } from "../api";
import "./HotelDetails.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NO_IMAGE_PLACEHOLDER = "https://placehold.co/800x600/eeeeee/999999?text=No+Image+Available";

const resolveImage = (img) => {
  if (!img) return NO_IMAGE_PLACEHOLDER;
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

const amenityIcons = {
  "Free WiFi": "📶", Restaurant: "🍽️", Spa: "💆", Garden: "🌿",
  "Room Service": "🛎️", Parking: "🅿️", "Heritage Tours": "🏛️",
  "Mountain View": "🏔️", "Infinity Pool": "🏊", Gym: "💪",
  Concierge: "🔑", Helipad: "🚁", "Adventure Desk": "🧗",
  Pool: "🏊", Jacuzzi: "🛁", "World-class Spa": "💆",
  "Multi-cuisine Restaurant": "🍜",
};

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchHotelById(id);
        setHotel(data.hotel);
        setRooms(data.hotel.rooms || []);
      } catch (err) {
        setError(err.message || "Hotel not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const imgCount = hotel?.images?.length || 0;
    if (imgCount <= 1) return;
    
    const interval = setInterval(() => {
      setActiveImg((prev) => (prev === imgCount - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [hotel]);

  if (loading) {
    return (
      <div className="hd-loading">
        <div className="hd-spinner" />
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="hd-loading">
        <p style={{ color: "#c62828" }}>{error || "Hotel not found"}</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: 16, padding: "10px 22px", background: "#1a1a2e",
            color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const images = hotel.images?.length > 0
    ? hotel.images
    : [NO_IMAGE_PLACEHOLDER];

  const handleBook = (room) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/traveler-login", {
        state: {
          returnTo: `/booking/${hotel._id}?room=${room._id}&type=${encodeURIComponent(room.roomType)}&price=${room.minPrice || room.price || 0}`
        }
      });
      return;
    }
    navigate(
      `/booking/${hotel._id}?room=${room._id}&type=${encodeURIComponent(room.roomType)}&price=${room.minPrice || room.price || 0}`
    );
  };

  return (
    <div className="hd-page">
      {/* Gallery */}
      <div className="hd-gallery">
        <div className="hd-main-img">
          <img
            src={resolveImage(images[activeImg])}
            alt={hotel.name}
            onError={(e) => {
              e.target.src = NO_IMAGE_PLACEHOLDER;
            }}
          />
          <div className="hd-img-overlay" />
          {images.length > 1 && (
            <div className="hd-img-nav">
              <button onClick={() => setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1))}>‹</button>
              <button onClick={() => setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1))}>›</button>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="hd-thumbs">
            {images.map((img, i) => (
              <img
                key={i}
                src={resolveImage(img)}
                alt=""
                className={i === activeImg ? "active" : ""}
                onClick={() => setActiveImg(i)}
                onError={(e) => {
                  e.target.src = NO_IMAGE_PLACEHOLDER;
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hd-content">
        {/* Left: Info */}
        <div className="hd-left">
          <div className="hd-header">
            <span className="hd-district">{hotel.district} Sikkim</span>
            <h1 className="hd-name">{hotel.name}</h1>
            <div className="hd-meta">
              <span className="hd-location">📍 {hotel.location}</span>
              {hotel.rating > 0 && (
                <span className="hd-rating">
                  ⭐ {hotel.rating.toFixed(1)}
                  <span className="hd-reviews">({hotel.totalReviews} reviews)</span>
                </span>
              )}
            </div>
          </div>

          <div className="hd-section">
            <h2 className="hd-section-title">About</h2>
            <p className="hd-desc">{hotel.description}</p>
          </div>

          {hotel.amenities?.length > 0 && (
            <div className="hd-section">
              <h2 className="hd-section-title">Amenities</h2>
              <div className="hd-amenities">
                {hotel.amenities.map((a) => (
                  <div key={a} className="hd-amenity">
                    <span>{amenityIcons[a] || "✓"}</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="hd-section">
            <h2 className="hd-section-title">Policies</h2>
            <div className="hd-policies">
              <div className="hd-policy">
                <strong>Check-in</strong>
                <span>{hotel.policies?.checkIn || "2:00 PM"}</span>
              </div>
              <div className="hd-policy">
                <strong>Check-out</strong>
                <span>{hotel.policies?.checkOut || "11:00 AM"}</span>
              </div>
              <div className="hd-policy">
                <strong>Cancellation</strong>
                <span>{hotel.policies?.cancellation || "Free cancellation up to 48 hours before check-in"}</span>
              </div>
              <div className="hd-policy">
                <strong>Children</strong>
                <span>{hotel.policies?.children || "Children above 5 years welcome"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rooms */}
        <div className="hd-right">
          <h2 className="hd-section-title">Available Rooms</h2>
          {rooms.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
              <p>No rooms listed yet for this hotel.</p>
            </div>
          ) : (
            <div className="hd-rooms">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className={`hd-room-card ${selectedRoom === room._id ? "selected" : ""}`}
                  onClick={() => setSelectedRoom(room._id)}
                >
                  <div className="hd-room-top">
                    <h3>{room.roomType}</h3>
                    <span
                      className={`hd-avail ${
                        room.availableRooms === 0
                          ? "none"
                          : room.availableRooms <= 2
                          ? "low"
                          : ""
                      }`}
                    >
                      {room.availableRooms === 0
                        ? "Sold Out"
                        : `${room.availableRooms} left`}
                    </span>
                  </div>
                  {room.features?.length > 0 && (
                    <div className="hd-room-features">
                      {room.features.map((f) => (
                        <span key={f}>{f}</span>
                      ))}
                    </div>
                  )}
                  <div className="hd-room-footer">
                    <div className="hd-room-price">
                      <span className="hd-room-price-val">₹{(room.minPrice || room.price || 0).toLocaleString()} {room.maxPrice > (room.minPrice || room.price || 0) ? `- ₹${room.maxPrice.toLocaleString()}` : ''}</span>
                      <span className="hd-room-price-night">/night</span>
                    </div>
                    <button
                      className="hd-book-btn"
                      disabled={room.availableRooms === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBook(room);
                      }}
                    >
                      {room.availableRooms === 0 ? "Sold Out" : "Book Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
