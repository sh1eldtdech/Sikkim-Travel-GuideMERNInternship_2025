import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Plus,
  Minus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Navigation,
  Target,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import styles from "./Adventure.module.css";

// Fix Leaflet default markers issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Adventure = () => {
  const [activeLocation, setActiveLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // user-added pins and path tracking removed
  const [mapCenter, setMapCenter] = useState([27.3389, 88.6065]); // Sikkim center
  const [mapZoom, setMapZoom] = useState(10);

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Adventure locations in Sikkim with real coordinates
  const adventureLocations = [
    {
      id: 1,
      name: "Kanchenjunga Base Camp",
      type: "Trekking",
      coordinates: [27.7025, 88.1475],
      description:
        "Experience the world's third highest peak up close. This challenging trek offers breathtaking views of the Kanchenjunga massif.",
      videoUrl: "/api/placeholder/400/300",
      difficulty: "Extreme",
      duration: "12-15 days",
      bestTime: "May-Oct",
      icon: "🏔️",
    },
    {
      id: 2,
      name: "Gurudongmar Lake",
      type: "Sacred Lake",
      coordinates: [27.6833, 88.75],
      description:
        "One of the highest lakes in the world at 17,800 feet. Sacred to both Hindus and Buddhists.",
      videoUrl: "/api/placeholder/400/300",
      difficulty: "Moderate",
      duration: "2-3 days",
      bestTime: "May-Oct",
      icon: "🏔️",
    },
    {
      id: 3,
      name: "Yumthang Valley",
      type: "Valley of Flowers",
      coordinates: [27.75, 88.7],
      description:
        "Known as the Valley of Flowers, this alpine valley bursts with rhododendrons and primulas in spring.",
      videoUrl: "/api/placeholder/400/300",
      difficulty: "Easy",
      duration: "1-2 days",
      bestTime: "Apr-Jun",
      icon: "🌸",
    },
    {
      id: 4,
      name: "Nathu La Pass",
      type: "Mountain Pass",
      coordinates: [27.3917, 88.8417],
      description:
        "Historic trade route between India and China at 14,140 feet altitude.",
      videoUrl: "/api/placeholder/400/300",
      difficulty: "Moderate",
      duration: "1 day",
      bestTime: "May-Oct",
      icon: "🏔️",
    },
    {
      id: 5,
      name: "Tsomgo Lake",
      type: "Glacial Lake",
      coordinates: [27.35, 88.75],
      description:
        "Sacred glacial lake surrounded by steep mountains, frozen during winter months.",
      videoUrl: "/api/placeholder/400/300",
      difficulty: "Easy",
      duration: "1 day",
      bestTime: "Mar-Dec",
      icon: "🏔️",
    },
    {
      id: 6,
      name: "Zuluk",
      type: "Silk Route",
      coordinates: [27.2167, 88.7167],
      description:
        "Historic Silk Route village offering panoramic views of the Eastern Himalayas.",
      videoUrl: "/api/placeholder/400/300",
      difficulty: "Moderate",
      duration: "2-3 days",
      bestTime: "Oct-May",
      icon: "🏔️",
    },
  ];

  // Custom icons for different adventure types
  const createCustomIcon = (location) => {
    const iconHtml = `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transform: rotate(-45deg);
        position: relative;
      ">
        <span style="transform: rotate(45deg);">${location.icon}</span>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: "custom-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  // Custom icon for user-added pins
  const createUserPinIcon = () => {
    const iconHtml = `
      <div style="
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        border: 2px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transform: rotate(-45deg);
      ">
        <span style="transform: rotate(45deg);">📍</span>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: "user-pin-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  // removed user pin creation (feature disabled)

  // Component to handle map events
  const MapEventHandler = () => {
    const map = useMapEvents({
      zoomend: () => {
        setMapZoom(map.getZoom());
      },
      moveend: () => {
        const center = map.getCenter();
        setMapCenter([center.lat, center.lng]);
      },
    });

    return null;
  };

  // Component to handle zoom controls
  const ZoomControls = () => {
    const map = useMap();

    const handleZoomIn = () => {
      map.zoomIn();
    };

    const handleZoomOut = () => {
      map.zoomOut();
    };

    const handleCenterMap = () => {
      map.setView([27.3389, 88.6065], 10);
    };

    return (
      <div className={styles.zoomControls}>
        {/* <button onClick={handleZoomIn} className={styles.zoomButton}>
          <Plus size={20} />
        </button> */}
        {/* <span className={styles.zoomLevel}>Zoom: {mapZoom}</span> */}
        {/* <button onClick={handleZoomOut} className={styles.zoomButton}>
          <Minus size={20} />
        </button> */}
        {/* <button
          onClick={handleCenterMap}
          className={styles.zoomButton}
          title="Center Map"
        >
          <Target size={20} />
        </button> */}
      </div>
    );
  };

  const handleLocationClick = (location) => {
    setActiveLocation(location);
    setShowModal(true);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // pin/path control functions removed

  return (
    <div className={styles.adventureContainer}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.starsLayer}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={styles.star}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Page Title */}
      <div className={styles.titleContainer}>
        {/* <h1 className={styles.pageTitle}>Adventure Zone</h1> */}
        {/* <p className={styles.subtitle}>Explore the Magnificent Adventures of Sikkim</p> */}
      </div>

      {/* Map Container */}
      <div className={styles.mapContainer}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Adventure Location Markers */}
          {adventureLocations.map((location) => (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={createCustomIcon(location)}
              eventHandlers={{
                click: () => handleLocationClick(location),
              }}
            >
              <Popup>
                <div className={styles.popupContent}>
                  <h3>{location.name}</h3>
                  <p className={styles.popupType}>{location.type}</p>
                  <p className={styles.popupDescription}>
                    {location.description}
                  </p>
                  <div className={styles.popupMeta}>
                    <span
                      className={`${styles.difficulty} ${styles[location.difficulty.toLowerCase()]}`}
                    >
                      {location.difficulty}
                    </span>
                    <span className={styles.duration}>{location.duration}</span>
                  </div>
                  <p className={styles.bestTime}>
                    Best Time: {location.bestTime}
                  </p>
                  <button
                    className={styles.popupButton}
                    onClick={() => handleLocationClick(location)}
                  >
                    Learn More
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* user-added pins and path tracking removed */}

          <MapEventHandler />
          <ZoomControls />
        </MapContainer>
      </div>

      {/* Control Panel */}
      {/* Control panel for pin/path features removed */}

      {/* Adventure Modal */}
      {showModal && activeLocation && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <h2>{activeLocation.name}</h2>
              <span className={styles.modalType}>{activeLocation.type}</span>
            </div>

            <div className={styles.mediaContainer}>
              <div className={styles.videoContainer}>
                <video
                  ref={videoRef}
                  className={styles.adventureVideo}
                  poster="/api/placeholder/600/400"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={activeLocation.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className={styles.videoControls}>
                  <button
                    onClick={togglePlayPause}
                    className={styles.playButton}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={toggleMute} className={styles.muteButton}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>

              <div className={styles.modalInfo}>
                <p className={styles.modalDescription}>
                  {activeLocation.description}
                </p>

                <div className={styles.adventureDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Difficulty:</span>
                    <span
                      className={`${styles.detailValue} ${styles[activeLocation.difficulty.toLowerCase()]}`}
                    >
                      {activeLocation.difficulty}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Duration:</span>
                    <span className={styles.detailValue}>
                      {activeLocation.duration}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Best Time:</span>
                    <span className={styles.detailValue}>
                      {activeLocation.bestTime}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Coordinates:</span>
                    <span className={styles.detailValue}>
                      {activeLocation.coordinates[0].toFixed(4)},{" "}
                      {activeLocation.coordinates[1].toFixed(4)}
                    </span>
                  </div>
                </div>

                <button className={styles.planTripButton}>
                  {/* Plan Your Adventure */}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio for Ambient Sounds */}
      <audio ref={audioRef} loop>
        <source src="/api/placeholder/audio" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Adventure;
