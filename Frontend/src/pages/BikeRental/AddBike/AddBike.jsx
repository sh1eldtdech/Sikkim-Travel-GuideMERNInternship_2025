import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useBikeOwnerAuth } from "../../../context/BikeOwnerAuthContext";
import API from "../../../utils/api";
import { ArrowLeft, Upload, X, MapPin, AlertCircle, Info, DollarSign } from "lucide-react";

const DISTRICTS = ["East", "West", "North", "South", "Other"];
const ALL_FEATURES = [
  "Helmet Included", "Fuel Included", "First Aid Kit", "GPS / Google Maps",
  "24hr Roadside Assist", "Insurance Covered", "Free Delivery",
  "Riding Gear Available", "Maintenance Covered", "Trail Maps",
];

const Field = ({ label, required, children, desc }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {desc && <p className="text-xs text-gray-400 font-medium">{desc}</p>}
  </div>
);

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400";

const AddBike = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.bikeData;
  const { bikeOwnerToken } = useBikeOwnerAuth();

  const authHeaders = {
    Authorization: `Bearer ${bikeOwnerToken}`,
    "Content-Type": "multipart/form-data",
  };

  const [form, setForm] = useState({
    name: editData?.name || "",
    cc: editData?.cc || "",
    description: editData?.description || "",
    hourlyRate: editData?.hourlyRate || "",
    dailyRate: editData?.dailyRate || "",
    contactNumber: editData?.contactNumber || "",
    location: editData?.location || "",
    district: editData?.district || "",
  });
  const [features, setFeatures] = useState(editData?.features || []);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(editData?.images || []);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleFeature = (f) =>
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (idx) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("features", JSON.stringify(features));
      images.forEach((img) => fd.append("images", img));

      if (editData) {
        await API.put(`/bikes/${editData._id}`, fd, { headers: authHeaders });
        toast.success("Bike updated successfully!");
      } else {
        await API.post("/bikes/add", fd, { headers: authHeaders });
        toast.success("Bike listed! Admin will review and approve it.");
      }
      setTimeout(() => navigate("/owner/bike-rental/my-bikes"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save bike. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/owner/bike-rental/dashboard")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {editData ? "Edit Listing" : "List a New Bike"}
              </h1>
              <p className="text-sm font-medium text-gray-500">Provide details about the rental</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Card 1: Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Info size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Full Bike Name" required desc="Include make and model">
                <input
                  name="name"
                  placeholder="e.g. Royal Enfield Himalayan 411"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Engine Capability (CC)" required desc="Numeric value only">
                <input
                  name="cc"
                  type="number"
                  min="50"
                  placeholder="e.g. 411"
                  value={form.cc}
                  onChange={handleChange}
                  required
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="mt-6">
              <Field label="Description" required desc="Highlight the condition and special traits">
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Well-maintained, perfectly suited for mountain terrains..."
                  value={form.description}
                  onChange={handleChange}
                  className={inputCls + " resize-none"}
                />
              </Field>
            </div>
          </div>

          {/* Card 2: Pricing */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Rental Pricing</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Hourly Rate (₹)" required>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    name="hourlyRate"
                    type="number" min="0" required
                    placeholder="100"
                    value={form.hourlyRate}
                    onChange={handleChange}
                    className={inputCls + " pl-8"}
                  />
                </div>
              </Field>
              <Field label="Daily Rate (₹)" required>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    name="dailyRate"
                    type="number" min="0" required
                    placeholder="800"
                    value={form.dailyRate}
                    onChange={handleChange}
                    className={inputCls + " pl-8"}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Card 3: Location */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Location & Contact</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Pickup Location / Address" required>
                <input
                  name="location" required
                  placeholder="e.g. MG Marg, Gangtok"
                  value={form.location}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
              <Field label="District" required>
                <select
                  name="district" required
                  value={form.district}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Select district</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d} Sikkim</option>
                  ))}
                </select>
              </Field>
              <Field label="Contact Number" required>
                <input
                  name="contactNumber" type="tel" required
                  placeholder="+91 98320 11234"
                  value={form.contactNumber}
                  onChange={handleChange}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* Card 4: Features */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Included Features</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Select all that apply to this rental</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {ALL_FEATURES.map((f) => {
                const active = features.includes(f);
                return (
                  <button
                    key={f} type="button"
                    onClick={() => toggleFeature(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      active
                        ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                        : "bg-white border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50"
                    }`}
                  >
                    {active ? "✓ " : ""}{f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 5: Images */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Upload size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Bike Photos</h2>
                  <p className="text-xs text-gray-500 font-medium">Upload up to 4 high-quality images</p>
                </div>
              </div>
            </div>

            <label
              htmlFor="bikeImages"
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-3xl p-10 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:scale-110 transition-all">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700 group-hover:text-orange-600">
                  {images.length > 0 ? `${images.length} file(s) selected` : "Click to browse images"}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-medium">JPG, PNG, WebP (Max 8MB each)</p>
              </div>
              <input id="bikeImages" type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {previews.map((src, i) => (
                  <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100 border border-gray-200">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePreview(i)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-sm text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-xl shadow-orange-200 flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-pulse">Processing...</span> : editData ? "Update Listing" : "Submit Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBike;
