import React from 'react';
import './About.css';
import { FaCalendarAlt, FaBus, FaHotel, FaUtensils, FaPhoneAlt, FaExclamationTriangle, FaTemperatureHigh, FaSignOutAlt, FaSyringe, FaVirus, FaShieldAlt, FaHospital, FaPassport, FaMapMarkerAlt, FaLock, FaFileAlt, FaIdCard, FaClock, FaBan } from 'react-icons/fa';

// Import images
import TravelGuideImage from '../../assets/travel-guide.jpeg';
import DisasterInfoImage from '../../assets/disaster-info.jpeg';
import CovidInfoImage from '../../assets/covid-info.jpg';
import BorderInfoImage from '../../assets/boder-info.jpg';
import NorthSikkimImage from '../../assets/north-sikkim.jpeg';
import SikkimHeroImage from '../../assets/sikkim-hero.jpg';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero" style={{ backgroundImage: `linear-gradient(rgba(49, 48, 48, 0.5), rgba(0, 0, 0, 0.5)), url(${SikkimHeroImage})` }}>
        <h1>Discover Sikkim</h1>
        <p>Your Gateway to the Himalayan Paradise</p>
        <div className="hero-overlay"></div>
      </div>

      <div className="about-content">
        {/* Travel Guide Section */}
        <section className="info-section">
          <div className="info-image">
            <img src={TravelGuideImage} alt="Sikkim Travel Guide" />
          </div>
          <div className="info-text">
            <h2><FaCalendarAlt className="section-icon" /> Travel Guide</h2>
            <p>Embark on an unforgettable journey through Sikkim's breathtaking landscapes and rich cultural heritage.</p>
            <div className="info-details">
              <div className="info-item">
                <h3><FaCalendarAlt /> Best Time to Visit</h3>
                <p>March to May (Spring) and October to December (Autumn) offer the most pleasant weather. Spring brings blooming rhododendrons, while autumn offers clear mountain views.</p>
              </div>
              <div className="info-item">
                <h3><FaBus /> Local Transportation</h3>
                <p>Shared jeeps and taxis are the primary modes of transport. Pre-book vehicles for long distances. Local buses connect major towns but may be crowded.</p>
              </div>
              <div className="info-item">
                <h3><FaHotel /> Accommodation Options</h3>
                <p>From luxury resorts to budget homestays, Sikkim offers diverse lodging options. Book in advance during peak seasons (March-May and October-December).</p>
              </div>
              <div className="info-item">
                <h3><FaUtensils /> Local Cuisine Guide</h3>
                <p>Try traditional dishes like momos, thukpa, and gundruk. Don't miss the local tea and organic produce from Sikkim's farms.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disaster Information Section */}
        <section className="info-section reverse">
          <div className="info-image">
            <img src={DisasterInfoImage} alt="Disaster Information" />
          </div>
          <div className="info-text">
            <h2><FaExclamationTriangle className="section-icon" /> Disaster Information</h2>
            <p>Stay safe and informed during your Sikkim adventure with our comprehensive emergency guide.</p>
            <div className="info-details">
              <div className="info-item">
                <h3><FaPhoneAlt /> Emergency Contacts</h3>
                <p>Police: 100 | Ambulance: 102 | Fire: 101 | Tourist Helpline: 1363</p>
              </div>
              <div className="info-item">
                <h3><FaExclamationTriangle /> Landslide Alerts</h3>
                <p>Monitor weather forecasts and local news. Avoid travel during heavy rainfall. Stay updated through Sikkim Tourism's official channels.</p>
              </div>
              <div className="info-item">
                <h3><FaTemperatureHigh /> Weather Warnings</h3>
                <p>Check daily weather updates. Be prepared for sudden weather changes, especially in high-altitude areas.</p>
              </div>
              <div className="info-item">
                <h3><FaSignOutAlt /> Evacuation Procedures</h3>
                <p>Follow local authorities' instructions. Keep emergency supplies ready. Know the nearest safe locations and evacuation routes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* COVID Information Section */}
        <section className="info-section">
          <div className="info-image">
            <img src={CovidInfoImage} alt="COVID Information" />
          </div>
          <div className="info-text">
            <h2><FaVirus className="section-icon" /> COVID Guidelines</h2>
            <p>Stay protected and informed about current health protocols in Sikkim.</p>
            <div className="info-details">
              <div className="info-item">
                <h3><FaSyringe /> Vaccination Requirements</h3>
                <p>Fully vaccinated travelers are preferred. Carry vaccination certificates. Booster doses recommended for international travelers.</p>
              </div>
              <div className="info-item">
                <h3><FaVirus /> Testing Protocols</h3>
                <p>RT-PCR test required within 72 hours of arrival. Rapid antigen tests available at major entry points.</p>
              </div>
              <div className="info-item">
                <h3><FaShieldAlt /> Safety Guidelines</h3>
                <p>Mask wearing in crowded places. Maintain social distancing. Regular hand sanitization recommended.</p>
              </div>
              <div className="info-item">
                <h3><FaHospital /> Health Facilities</h3>
                <p>24/7 medical support available. Major hospitals in Gangtok, Namchi, and Mangan. COVID care centers in all districts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Border Guidelines Section */}
        <section className="info-section reverse">
          <div className="info-image">
            <img src={BorderInfoImage} alt="Border Guidelines" />
          </div>
          <div className="info-text">
            <h2><FaPassport className="section-icon" /> Border Guidelines</h2>
            <p>Essential information for smooth entry into Sikkim.</p>
            <div className="info-details">
              <div className="info-item">
                <h3><FaFileAlt /> Entry Permits</h3>
                <p>Inner Line Permit (ILP) required for all visitors. Apply online or at entry checkpoints. Valid for 7-30 days depending on nationality.</p>
              </div>
              <div className="info-item">
                <h3><FaMapMarkerAlt /> Border Checkpoints</h3>
                <p>Major entry points at Rangpo, Melli, and Jorethang. Keep documents ready for inspection. Foreign nationals need additional permits.</p>
              </div>
              <div className="info-item">
                <h3><FaLock /> Restricted Areas</h3>
                <p>Special permits needed for border areas. Photography restrictions in sensitive zones. Follow local guidelines strictly.</p>
              </div>
              <div className="info-item">
                <h3><FaFileAlt /> Documentation Requirements</h3>
                <p>Valid ID proof, passport photos, and travel itinerary required. Foreign nationals need passport and visa copies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* North Sikkim Permit Guidelines Section */}
        <section className="info-section">
          <div className="info-image">
            <img src={NorthSikkimImage} alt="North Sikkim Permit Guidelines" />
          </div>
          <div className="info-text">
            <h2><FaIdCard className="section-icon" /> North Sikkim Permit Guidelines</h2>
            <p>Navigate the permit process for North Sikkim's pristine landscapes.</p>
            <div className="info-details">
              <div className="info-item">
                <h3><FaFileAlt /> Permit Application Process</h3>
                <p>Apply through registered travel agents or online portal. Processing time: 1-2 working days. Group permits available.</p>
              </div>
              <div className="info-item">
                <h3><FaIdCard /> Required Documents</h3>
                <p>Valid ID proof, passport photos, hotel bookings, and travel itinerary. Foreign nationals need additional documentation.</p>
              </div>
              <div className="info-item">
                <h3><FaClock /> Permit Validity</h3>
                <p>Valid for specific dates only. Maximum stay: 7 days. Non-extendable. Must be carried at all times.</p>
              </div>
              <div className="info-item">
                <h3><FaBan /> Restricted Areas</h3>
                <p>Special permits needed for Gurudongmar Lake and Yumthang Valley. Photography restrictions in certain areas.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
