import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminHotels.module.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminSecret, setAdminSecret] = useState(localStorage.getItem('adminSecret') || '');
  const [isAuthorized, setIsAuthorized] = useState(!!localStorage.getItem('adminSecret'));

  useEffect(() => {
    if (isAuthorized) {
      fetchPendingHotels();
    }
  }, [isAuthorized]);

  const fetchPendingHotels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin/hotels/pending`, {
        headers: { 'x-admin-secret': adminSecret }
      });
      setHotels(res.data.hotels);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching hotels');
      if (err.response?.status === 403) {
        setIsAuthorized(false);
        localStorage.removeItem('adminSecret');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      if (!window.confirm("Approve this hotel for listing?")) return;
      await axios.patch(`${BASE_URL}/admin/hotels/${id}/approve`, {}, {
        headers: { 'x-admin-secret': adminSecret }
      });
      setHotels(hotels.filter(h => h._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve hotel');
    }
  };

  const handleReject = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to reject and remove this hotel?")) return;
      await axios.patch(`${BASE_URL}/admin/hotels/${id}/reject`, {}, {
        headers: { 'x-admin-secret': adminSecret }
      });
      setHotels(hotels.filter(h => h._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject hotel');
    }
  };

  if (!isAuthorized) {
    return (
      <div className={styles.authWrapper}>
        <div className={styles.authCard}>
          <div className={styles.authIconWrapper}>
            <svg className={styles.authIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className={styles.authTitle}>Administrator Portal</h2>
          <p className={styles.authSubtitle}>Please authenticate to continue securely.</p>
          
          <div className={styles.formGroup}>
            <input 
              type="password" 
              placeholder="Enter Admin Secret Key" 
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className={styles.inputField}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && adminSecret) {
                  localStorage.setItem('adminSecret', adminSecret);
                  setIsAuthorized(true);
                }
              }}
            />
            <button 
              onClick={() => {
                if(!adminSecret) return;
                localStorage.setItem('adminSecret', adminSecret);
                setIsAuthorized(true);
              }}
              className={styles.btnAuthenticate}
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Review Pending Hotels</h1>
          <p className={styles.pageSubtitle}>Manage new property listings awaiting approval.</p>
        </div>
        <button 
          className={styles.btnGhost}
          onClick={() => {
            setIsAuthorized(false);
            localStorage.removeItem('adminSecret');
          }}
        >
          <svg className={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>

      <div className={styles.mainContent}>
        {error && (
          <div className={styles.errorAlert}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Gathering pending properties...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" /></svg>
            <h3>All Caught Up!</h3>
            <p>There are no pending hotels waiting for your review.</p>
          </div>
        ) : (
          <div className={styles.hotelGrid}>
            {hotels.map(hotel => (
              <div key={hotel._id} className={styles.hotelCard}>
                
                <div className={styles.cardGallery}>
                  {hotel.images && hotel.images.length > 0 ? (
                    <img src={hotel.images[0]} alt={hotel.name} className={styles.mainImage} />
                  ) : (
                    <div className={styles.noImagePlaceholder}>No Image</div>
                  )}
                  {hotel.images && hotel.images.length > 1 && (
                    <div className={styles.thumbnailStrip}>
                      {hotel.images.slice(1, 4).map((img, i) => (
                        <div key={i} className={styles.thumbnailWrapper}>
                          <img src={img} alt="thumbnail" className={styles.thumbnail} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.hotelName}>{hotel.name}</h3>
                    <span className={styles.badgePending}>Pending</span>
                  </div>
                  
                  <div className={styles.infoGroup}>
                    <div className={styles.infoRow}>
                      <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>{hotel.district}, {hotel.location}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span>{hotel.owner?.name} &bull; {hotel.owner?.email}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      <span className={styles.upiText}>UPI: {hotel.paymentDetails?.upiId || "N/A"}</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button 
                      className={styles.btnReject} 
                      onClick={() => handleReject(hotel._id)}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      Reject
                    </button>
                    <button 
                      className={styles.btnApprove} 
                      onClick={() => handleApprove(hotel._id)}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Approve
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHotels;
