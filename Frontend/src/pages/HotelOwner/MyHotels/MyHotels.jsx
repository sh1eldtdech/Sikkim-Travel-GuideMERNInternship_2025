import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../../utils/api";
import styles from "./MyHotels.module.css";

const MyHotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deactivating, setDeactivating] = useState(null);

  const fetchHotels = async () => {
    try {
      const { data } = await API.get("/hotels/owner/my-hotels");
      setHotels(data.hotels);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load hotels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleToggleStatus = async (hotel) => {
    setDeactivating(hotel._id);
    try {
      const newStatus = !hotel.isActive;
      await API.patch(`/hotels/${hotel._id}/status`, { isActive: newStatus });
      setHotels((prev) =>
        prev.map((h) => (h._id === hotel._id ? { ...h, isActive: newStatus } : h))
      );
      toast.success(`Hotel successfully ${newStatus ? "reactivated" : "deactivated"}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setDeactivating(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel permanently?"))
      return;
    try {
      await API.delete(`/hotels/${id}`);
      setHotels((prev) => prev.filter((h) => h._id !== id));
      toast.success("Hotel deleted permanently.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete hotel.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/owner/dashboard")}
        >
          Back to dashboard
        </button>
        <h1 className={styles.title}>My Listed Hotels</h1>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/owner/add-hotel")}
        >
          Add Hotel
        </button>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Finding hotels...</p>
        </div>
      ) : hotels.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No hotels listed yet</h2>
          <p>Start by adding your first hotel property.</p>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/owner/add-hotel")}
          >
            Add your first hotel
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {hotels.map((hotel) => (
            <div
              key={hotel._id}
              className={`${styles.hotelCard} ${!hotel.isActive ? styles.inactive : ""}`}
            >
              {/* Image */}
              <div className={styles.imageWrap}>
                {hotel.images && hotel.images.length > 0 ? (
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className={styles.hotelImg}
                  />
                ) : (
                  <div className={styles.noImage}>No image available</div>
                )}
                <div
                  className={`${styles.statusBadge} ${hotel.isActive ? styles.activeBadge : styles.inactiveBadge}`}
                >
                  {hotel.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Info */}
              <div className={styles.info}>
                <h3 className={styles.hotelName}>{hotel.name}</h3>
                <p className={styles.location}>
                  {hotel.location} · {hotel.district} Sikkim
                </p>
                <div className={styles.meta}>
                  <span>{hotel.rooms?.length || 0} room type(s)</span>
                  <span>{hotel.rating || "N/A"} rating</span>
                </div>
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className={styles.amenities}>
                    {hotel.amenities.slice(0, 4).map((a) => (
                      <span key={a} className={styles.tag}>
                        {a}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className={styles.moreTag}>
                        +{hotel.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => navigate("/owner/add-hotel", { state: { hotelData: hotel } })}
                >
                  Edit Details
                </button>
                <button
                  className={hotel.isActive ? styles.deactivateBtn : styles.reactivateBtn}
                  onClick={() => handleToggleStatus(hotel)}
                  disabled={deactivating === hotel._id}
                >
                  {deactivating === hotel._id
                    ? "Processing..."
                    : hotel.isActive
                      ? "Deactivate"
                      : "Reactivate"}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(hotel._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHotels;
