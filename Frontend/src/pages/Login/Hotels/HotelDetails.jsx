import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HotelDetails.css";

const sampleHotels = {
  "1": {
    _id: "1",
    name: "The Elgin Nor-Khill",
    district: "East",
    location: "Gangtok, East Sikkim",
    description:
      "A heritage hotel with stunning views of Kanchenjunga, offering luxurious rooms and traditional Sikkimese architecture in the heart of Gangtok. Built in 1932 as a royal guesthouse, The Elgin Nor-Khill is steeped in history and charm. The hotel features beautifully landscaped gardens, a heritage lounge, and personalized service that reflects the warmth of Sikkimese hospitality.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    ],
    amenities: ["Free WiFi", "Restaurant", "Spa", "Garden", "Room Service", "Parking", "Heritage Tours", "Mountain View"],
    rating: 4.8,
    totalReviews: 312,
    rooms: [
      { _id: "r1", roomType: "Standard Heritage", price: 4500, availableRooms: 3, features: ["Mountain View", "Queen Bed", "Heritage Decor"] },
      { _id: "r2", roomType: "Deluxe Suite", price: 7200, availableRooms: 2, features: ["Panoramic View", "King Bed", "Private Balcony", "Clawfoot Tub"] },
      { _id: "r3", roomType: "Royal Suite", price: 12000, availableRooms: 1, features: ["360° View", "King Bed", "Living Area", "Personal Butler"] },
    ],
    policies: {
      checkIn: "2:00 PM",
      checkOut: "11:00 AM",
      cancellation: "Free cancellation up to 48 hours before check-in",
      children: "Children above 5 years welcome",
    },
  },
  "2": {
    _id: "2",
    name: "Mayfair Spa Resort",
    district: "East",
    location: "Gangtok, East Sikkim",
    description:
      "Premium resort with world-class spa, infinity pool, and panoramic Himalayan views. Mayfair Spa Resort is set amidst pine forests and offers an unmatched luxury experience in the lap of the Himalayas. The resort features award-winning restaurants, a wellness centre, and curated adventure experiences.",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    ],
    amenities: ["Infinity Pool", "World-class Spa", "Multi-cuisine Restaurant", "Gym", "Free WiFi", "Concierge", "Helipad", "Adventure Desk"],
    rating: 4.6,
    totalReviews: 204,
    rooms: [
      { _id: "r1", roomType: "Deluxe Room", price: 6200, availableRooms: 4, features: ["Garden View", "King Bed", "Rainfall Shower"] },
      { _id: "r2", roomType: "Premium Suite", price: 9500, availableRooms: 2, features: ["Pool Access", "King Bed", "Jacuzzi", "Balcony"] },
      { _id: "r3", roomType: "Luxury Villa", price: 18000, availableRooms: 1, features: ["Private Pool", "2 Bedrooms", "Butler Service", "Kanchenjunga View"] },
    ],
    policies: {
      checkIn: "3:00 PM",
      checkOut: "12:00 PM",
      cancellation: "Free cancellation up to 72 hours before check-in",
      children: "Children of all ages welcome",
    },
  },
};

const amenityIcons = {
  "Free WiFi": "📶",
  Restaurant: "🍽️",
  Spa: "💆",
  Garden: "🌿",
  "Room Service": "🛎️",
  Parking: "🅿️",
  "Heritage Tours": "🏛️",
  "Mountain View": "🏔️",
  "Infinity Pool": "🏊",
  "World-class Spa": "💆",
  "Multi-cuisine Restaurant": "🍜",
  Gym: "💪",
  Concierge: "🔑",
  Helipad: "🚁",
  "Adventure Desk": "🧗",
  Pool: "🏊",
  Jacuzzi: "🛁",
};

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    // In real app: fetch(`/api/hotel/${id}`)
    const found = sampleHotels[id];
    if (found) {
      setHotel(found);
    }
  }, [id]);

  if (!hotel) {
    return (
      <div className="hd-loading">
        <div className="hd-spinner" />
        <p>Loading hotel details...</p>
      </div>
    );
  }

  const handleBook = (room) => {
    const user = localStorage.getItem("token");
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/booking/${hotel._id}?room=${room._id}&type=${encodeURIComponent(room.roomType)}&price=${room.price}`);
  };

  return (
    <div className="hd-page">
      {/* Gallery */}
      <div className="hd-gallery">
        <div className="hd-main-img">
          <img src={hotel.images[activeImg]} alt={hotel.name} />
          <div className="hd-img-overlay" />
          <div className="hd-img-nav">
            <button onClick={() => setActiveImg((p) => (p === 0 ? hotel.images.length - 1 : p - 1))}>‹</button>
            <button onClick={() => setActiveImg((p) => (p === hotel.images.length - 1 ? 0 : p + 1))}>›</button>
          </div>
        </div>
        <div className="hd-thumbs">
          {hotel.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={i === activeImg ? "active" : ""}
              onClick={() => setActiveImg(i)}
            />
          ))}
        </div>
      </div>

      <div className="hd-content">
        {/* Left: Info */}
        <div className="hd-left">
          <div className="hd-header">
            <span className="hd-district">{hotel.district} Sikkim</span>
            <h1 className="hd-name">{hotel.name}</h1>
            <div className="hd-meta">
              <span className="hd-location">📍 {hotel.location}</span>
              <span className="hd-rating">
                ⭐ {hotel.rating}
                <span className="hd-reviews">({hotel.totalReviews} reviews)</span>
              </span>
            </div>
          </div>

          <div className="hd-section">
            <h2 className="hd-section-title">About</h2>
            <p className="hd-desc">{hotel.description}</p>
          </div>

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

          <div className="hd-section">
            <h2 className="hd-section-title">Policies</h2>
            <div className="hd-policies">
              <div className="hd-policy">
                <strong>Check-in</strong>
                <span>{hotel.policies.checkIn}</span>
              </div>
              <div className="hd-policy">
                <strong>Check-out</strong>
                <span>{hotel.policies.checkOut}</span>
              </div>
              <div className="hd-policy">
                <strong>Cancellation</strong>
                <span>{hotel.policies.cancellation}</span>
              </div>
              <div className="hd-policy">
                <strong>Children</strong>
                <span>{hotel.policies.children}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rooms */}
        <div className="hd-right">
          <h2 className="hd-section-title">Available Rooms</h2>
          <div className="hd-rooms">
            {hotel.rooms.map((room) => (
              <div
                key={room._id}
                className={`hd-room-card ${selectedRoom === room._id ? "selected" : ""}`}
                onClick={() => setSelectedRoom(room._id)}
              >
                <div className="hd-room-top">
                  <h3>{room.roomType}</h3>
                  <span className={`hd-avail ${room.availableRooms === 0 ? "none" : room.availableRooms <= 2 ? "low" : ""}`}>
                    {room.availableRooms === 0 ? "Sold Out" : `${room.availableRooms} left`}
                  </span>
                </div>
                <div className="hd-room-features">
                  {room.features.map((f) => (
                    <span key={f}>{f}</span>
                  ))}
                </div>
                <div className="hd-room-footer">
                  <div className="hd-room-price">
                    <span className="hd-room-price-val">₹{room.price.toLocaleString()}</span>
                    <span className="hd-room-price-night">/night</span>
                  </div>
                  <button
                    className="hd-book-btn"
                    disabled={room.availableRooms === 0}
                    onClick={(e) => { e.stopPropagation(); handleBook(room); }}
                  >
                    {room.availableRooms === 0 ? "Sold Out" : "Book Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
