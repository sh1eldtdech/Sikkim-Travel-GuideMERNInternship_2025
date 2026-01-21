import React, { useState, useEffect } from 'react';
import './ContactUs.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Check if API key is available and load Google Maps API
  useEffect(() => {
    const apiKey = import.meta.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'your_actual_api_key_here') {
      setHasApiKey(false);
      return;
    }

    setHasApiKey(true);

    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setHasApiKey(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when loaded
  useEffect(() => {
    if (mapLoaded && hasApiKey) {
      initializeMap();
    }
  }, [mapLoaded, hasApiKey]);

  const initializeMap = () => {
    const mapOptions = {
      center: { lat: 27.3389, lng: 88.6065 }, // Gangtok coordinates
      zoom: 15,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ color: '#f5f5f5' }]
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [{ color: '#6ba3d6' }]
        }
      ]
    };

    const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

    // Add marker
    const marker = new window.google.maps.Marker({
      position: { lat: 27.3389, lng: 88.6065 },
      map: map,
      title: 'SH1ELD Tech Office',
      animation: window.google.maps.Animation.DROP
    });

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 10px 0; color: #2c5282;">SH1ELD Tech GuideBook</h3>
          <p style="margin: 5px 0; color: #4a5568;">J.N Road, near 2nd petrol pump</p>
          <p style="margin: 5px 0; color: #4a5568;">Gangtok, Sikkim 737103</p>
          <p style="margin: 5px 0; color: #4a5568;">📞 +917903994710</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Simulate form submission (replace with your actual API call)
    try {
      // Here you would typically send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openMapInNewTab = () => {
    const mapUrl = `https://www.google.com/maps/place/Mahatma+Gandhi+Marg/@27.3253821,88.6093151,837m/data=!3m1!1e3!4m7!3m6!1s0x39e6a51504b9b95b:0xe44eb58d5a699d1!4b1!8m2!3d27.3253821!4d88.61189!16s%2Fg%2F1tp1x6zg?entry=ttu&g_ep=EgoyMDI1MDYyNi4wIKXMDSoASAFQAw%3D%3D`;
    window.open(mapUrl, '_blank');
  };

  const MapPreview = () => (
    <div className="map-preview">
      <div className="map-preview-content">
        <div className="preview-header">
          <h3>📍 Our Location</h3>
          <p>MG Marg, Gangtok, Sikkim</p>
        </div>
        <div className="preview-image">
          <img 
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236ba3d6;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%234a90a4;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23bg)'/%3E%3Cpath d='M0,150 Q100,100 200,150 T400,150 L400,300 L0,300 Z' fill='%23e8f5e8'/%3E%3Cpath d='M0,180 Q150,130 300,180 T400,180 L400,300 L0,300 Z' fill='%23d4eecd'/%3E%3Cpath d='M50,200 L150,160 L250,190 L350,170 L400,180 L400,300 L0,300 Z' fill='%23c5e8ba'/%3E%3Ccircle cx='200' cy='150' r='8' fill='%23dc2626'/%3E%3Ccircle cx='200' cy='150' r='4' fill='white'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%232d3748' font-family='Arial' font-size='14' font-weight='bold'%3EGangtok, Sikkim%3C/text%3E%3C/svg%3E" 
            alt="Gangtok Location Preview"
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
          />
        </div>
        <div className="preview-info">
          <div className="location-details">
            {/* <p><strong>J.N Road, near 2nd petrol pump</strong></p> */}
            <p>Gangtok, Sikkim 737103</p>
          </div>
          <button className="preview-btn" onClick={openMapInNewTab}>
            🗺️ View on Google Maps
          </button>
        </div>
        {!hasApiKey && (
          <div className="api-key-notice">
            {/* <p>💡 Add Google Maps API key for interactive map</p> */}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">Get in Touch</h1>
          <p className="hero-subtitle">
            Ready to explore the beautiful landscapes of Sikkim? We're here to help plan your perfect adventure!
          </p>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="contact-content">
        <div className="contact-main">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2 className="section-title">Contact Information</h2>
            <div className="contact-cards">
              <div className="contact-card">
                <div className="card-icon phone-icon">📞</div>
                <h3>Phone</h3>
                <p>+91 9547250772</p>
                <span className="card-subtitle">Call us anytime</span>
              </div>
              
              <div className="contact-card">
                <div className="card-icon email-icon">✉️</div>
                <h3>Email</h3>
                <p>shieldslabs@gmail.com</p>
                <span className="card-subtitle">We'll respond within 24 hours</span>
              </div>
              
              <div className="contact-card">
                <div className="card-icon location-icon">📍</div>
                <h3>Address</h3>
                <p>Mahatma Gandhi,<br/>Marg, Gangtok<br/>Sikkim, 737103</p>
                {/* <span className="card-subtitle">Visit our office</span> */}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2 className="section-title">Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Tell us about your travel plans, questions, or how we can help you..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
              
              {submitStatus === 'success' && (
                <div className="status-message success">
                  ✅ Thank you! Your message has been sent successfully. We'll get back to you soon!
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="status-message error">
                  ❌ Sorry, there was an error sending your message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <div 
            className="map-container"
            onMouseEnter={(e) => {
              const overlay = e.currentTarget.querySelector('.map-overlay');
              if (overlay) overlay.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const overlay = e.currentTarget.querySelector('.map-overlay');
              if (overlay) overlay.style.opacity = '0';
            }}
          >
            {hasApiKey ? (
              <>
                <div id="map" className="google-map"></div>
                {mapLoaded && (
                  <div className="map-overlay" onClick={openMapInNewTab}>
                    <div className="map-overlay-content">
                      <span className="map-icon">🗺️</span>
                      <span>View Map</span>
                    </div>
                  </div>
                )}
                {!mapLoaded && (
                  <div className="map-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading interactive map...</p>
                  </div>
                )}
              </>
            ) : (
              <MapPreview />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;