import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../utils/api";
import styles from "./AddHotel.module.css";

const DISTRICTS = ["East", "West", "North", "South"];
const ALL_AMENITIES = [
  "Free WiFi",
  "Parking",
  "Restaurant",
  "Room Service",
  "Swimming Pool",
  "Spa",
  "Gym",
  "Laundry",
  "Air Conditioning",
  "Hot Water",
  "Mountain View",
  "Tour Desk",
  "24hr Front Desk",
  "Bar",
  "Conference Room",
];

const AddHotel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.hotelData;

  const [form, setForm] = useState({
    name: editData?.name || "",
    district: editData?.district || "",
    location: editData?.location || "",
    description: editData?.description || "",
    checkIn: editData?.policies?.checkIn || "",
    checkOut: editData?.policies?.checkOut || "",
    cancellation: editData?.policies?.cancellation || "",
    children: editData?.policies?.children || "",
    roomType: editData?.rooms?.[0]?.roomType || "",
    price: editData?.rooms?.[0]?.price || "",
    totalRooms: editData?.rooms?.[0]?.totalRooms || "",
    availableRooms: editData?.rooms?.[0]?.availableRooms || "",
  });
  const [amenities, setAmenities] = useState(editData?.amenities || []);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(editData?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAmenity = (a) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("district", form.district);
      fd.append("location", form.location);
      fd.append("description", form.description);
      fd.append("amenities", JSON.stringify(amenities));
      fd.append(
        "policies",
        JSON.stringify({
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          cancellation: form.cancellation,
          children: form.children,
        }),
      );
      images.forEach((img) => fd.append("images", img));

      if (editData) {
        await API.put(`/hotels/${editData._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (editData.rooms && editData.rooms.length > 0) {
          const mainRoomId = editData.rooms[0]._id;
          await API.put(`/rooms/${mainRoomId}`, {
            roomType: form.roomType,
            price: form.price,
            totalRooms: form.totalRooms,
            availableRooms: form.availableRooms,
          });
        } else {
          // If the hotel was added before rooms functionality, create the first room now
          await API.post("/rooms/add", {
            hotelId: editData._id,
            roomType: form.roomType,
            price: form.price,
            totalRooms: form.totalRooms,
            availableRooms: form.availableRooms,
          });
        }
        setSuccess("Hotel data and rooms updated successfully.");
      } else {
        const resHotel = await API.post("/hotels/add", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Initialize primary room data for the new hotel
        await API.post("/rooms/add", {
          hotelId: resHotel.data.hotel._id,
          roomType: form.roomType,
          price: form.price,
          totalRooms: form.totalRooms,
          availableRooms: form.availableRooms,
        });

        setSuccess("Hotel and its rooms listed successfully.");
      }
      setTimeout(() => navigate("/owner/my-hotels"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/owner/dashboard")}
          >
            Back to dashboard
          </button>
          <h1 className={styles.pageTitle}>{editData ? "Edit Hotel Details" : "Add New Hotel"}</h1>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}
        {success && <div className={styles.successBox}>{success}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Basic Info */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Hotel Name *</label>
                <input
                  name="name"
                  placeholder="e.g. The Mountain Retreat"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>District *</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select district</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} Sikkim
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label>Location / Address *</label>
              <input
                name="location"
                placeholder="e.g. MG Marg, Gangtok, East Sikkim"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Description *</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe your hotel, its specialties, surroundings..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          {/* Room Configuration */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Default Room Setup</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Room Type *</label>
                <input
                  name="roomType"
                  placeholder="e.g. Deluxe Room"
                  value={form.roomType}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Price per Night (₹) *</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Total Rooms *</label>
                <input
                  type="number"
                  name="totalRooms"
                  min="1"
                  value={form.totalRooms}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Available Rooms *</label>
                <input
                  type="number"
                  name="availableRooms"
                  min="0"
                  max={form.totalRooms}
                  value={form.availableRooms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Amenities</h2>
            <div className={styles.amenitiesGrid}>
              {ALL_AMENITIES.map((a) => (
                <button
                  type="button"
                  key={a}
                  className={`${styles.amenityChip} ${amenities.includes(a) ? styles.activeChip : ""}`}
                  onClick={() => toggleAmenity(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </section>

          {/* Policies */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Policies</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Check-in Time</label>
                <input
                  name="checkIn"
                  value={form.checkIn}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label>Check-out Time</label>
                <input
                  name="checkOut"
                  value={form.checkOut}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>Cancellation Policy</label>
              <input
                name="cancellation"
                value={form.cancellation}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label>Children Policy</label>
              <input
                name="children"
                value={form.children}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Images */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Hotel Images (up to 6)</h2>
            <div className={styles.imageUploadArea}>
              <input
                type="file"
                id="hotelImages"
                multiple
                accept="image/*"
                onChange={handleImages}
                style={{ display: "none" }}
              />
              <label htmlFor="hotelImages" className={styles.uploadLabel}>
                <span>
                  {images.length > 0
                    ? `${images.length} image(s) selected`
                    : "Click to upload images (JPG, PNG, WebP)"}
                </span>
              </label>
            </div>
            {previews.length > 0 && (
              <div className={styles.previews}>
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className={styles.previewImg}
                  />
                ))}
              </div>
            )}
          </section>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Saving data..." : editData ? "Update hotel" : "List hotel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;
