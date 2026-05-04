import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGovAuth } from "../../../context/GovAuthContext";
import API from "../../../utils/api";

const DEPT_LABEL = {
  Tourism: "Tourism Department",
  Police: "Police Department",
  Disaster: "Disaster Management",
  Revenue: "Revenue Department",
  Health: "Health Department",
  PWD: "PWD (Roads)",
  Forest: "Forest Department",
};

const SEVERITY_COLORS = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Critical: "bg-red-100 text-red-800",
};

const CAT_ICONS = {
  Landslide: "", Flood: "", Travel: "", Rainfall: "",
  Snowfall: "", Earthquake: "", Highway: "", General: "",
};

export default function GovernmentDashboard() {
  const navigate = useNavigate();
  const { official, logout, isAuthenticated, authLoading } = useGovAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "", content: "", category: "General", severity: "Medium", affectedAreas: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [file, setFile] = useState(null);
  const [viewAttachmentUrl, setViewAttachmentUrl] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/government-login");
  }, [authLoading, isAuthenticated, navigate]);

  const fetchNotices = useCallback(async () => {
    setLoadingNotices(true);
    try {
      const { data } = await API.get("/notices/my");
      setNotices(data.notices || []);
    } catch { setNotices([]); }
    finally { setLoadingNotices(false); }
  }, []);

  useEffect(() => { if (isAuthenticated) fetchNotices(); }, [isAuthenticated, fetchNotices]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim() || !uploadForm.category || !uploadForm.severity || !uploadForm.affectedAreas.trim()) {
      setUploadError("Title, Category, Severity, and Affected Areas are required.");
      return;
    }
    setUploading(true); setUploadError(""); setUploadSuccess("");
    try {
      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("content", uploadForm.content);
      formData.append("category", uploadForm.category);
      formData.append("severity", uploadForm.severity);
      formData.append("affectedAreas", uploadForm.affectedAreas);
      if (file) formData.append("file", file);

      await API.post("/notices/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadSuccess("Notice uploaded successfully!");
      setUploadForm({ title: "", content: "", category: "General", severity: "Medium", affectedAreas: "" });
      setFilePreview(null);
      setFileType(null);
      setFile(null);
      fetchNotices();
      setTimeout(() => { setUploadSuccess(""); setActiveTab("notices"); }, 2000);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload notice.");
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notices/${id}`);
      setNotices(prev => prev.filter(n => n._id !== id));
      setDeleteConfirm(null);
    } catch { alert("Failed to delete notice."); }
  };

  const handleLogout = async () => { await logout(); navigate("/government-login"); };

  const activeNotices = notices.filter(n => new Date(n.expiresAt) > new Date());
  const expiringSoon = notices.filter(n => {
    const diff = new Date(n.expiresAt) - new Date();
    return diff > 0 && diff < 5 * 24 * 60 * 60 * 1000;
  });

  const daysLeft = (expiresAt) => {
    const diff = new Date(expiresAt) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Only PDF and image files (JPG, PNG, WebP) are allowed.");
        return;
      }
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
      setFileType(selectedFile.type.startsWith('image/') ? 'image' : 'pdf');
      setFile(selectedFile);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-[#1a5c38] text-lg font-semibold">Loading...</div>
    </div>
  );

  const NAV = [
    { id: "overview", label: "Dashboard Overview" },
    { id: "upload", label: "Upload Notice" },
    { id: "notices", label: "My Notices" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex relative z-10" style={{ fontFamily: "'Public Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-[#1a5c38] flex flex-col z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:h-auto lg:flex lg:flex-col shadow-xl`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {official?.name?.[0] || "G"}
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">{official?.name || "Official"}</p>
              <p className="text-white/60 text-xs">{DEPT_LABEL[official?.department] || official?.department}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3">
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setActiveTab(n.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm font-semibold transition-all duration-150 ${activeTab === n.id ? "bg-white/20 text-white border-l-4 border-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-semibold">
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-[#1a5c38]">
              ☰
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Sikkim Travel Guide - Administration</h1>
              <p className="text-xs text-gray-500 mt-1">{DEPT_LABEL[official?.department]} Portal</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#e8f5ee] text-[#1a5c38] text-xs font-bold px-3 py-1.5 rounded-full">
            {DEPT_LABEL[official?.department] || "Government Official"}
          </span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Welcome, {official?.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{official?.designation} · {DEPT_LABEL[official?.department]}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Notices", value: notices.length, bg: "bg-blue-50", tc: "text-blue-800" },
                  { label: "Active Notices", value: activeNotices.length, bg: "bg-green-50", tc: "text-green-800" },
                  { label: "Expiring Soon", value: expiringSoon.length, bg: "bg-orange-50", tc: "text-orange-800" },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-xl p-5 border border-white shadow-sm`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{s.label}</p>
                        <p className={`text-4xl font-bold mt-1 ${s.tc}`}>{s.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setActiveTab("upload")}
                className="flex items-center gap-2 bg-[#1a5c38] hover:bg-[#2d7a50] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5 mb-8">
                Upload New Notice
              </button>

              {/* Recent notices */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Recent Notices</h3>
                  <button onClick={() => setActiveTab("notices")} className="text-[#1a5c38] text-sm font-semibold hover:underline">View all →</button>
                </div>
                {loadingNotices ? (
                  <div className="p-6 text-center text-gray-400">Loading...</div>
                ) : notices.slice(0, 4).length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No notices uploaded yet.</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notices.slice(0, 4).map(n => (
                      <div key={n._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-0.5">{DEPT_LABEL[official?.department]} · {new Date(n.createdAt).toLocaleDateString("en-IN")}</p>
                          <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${daysLeft(n.expiresAt) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {daysLeft(n.expiresAt) > 0 ? `${daysLeft(n.expiresAt)}d left` : "Expired"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === "upload" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Upload New Notice</h2>
                <p className="text-gray-500 text-sm mb-6">Notice will auto-expire after 30 days.</p>

                {uploadSuccess && <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl font-semibold text-sm">{uploadSuccess}</div>}
                {uploadError && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl font-semibold text-sm">{uploadError}</div>}

                <form onSubmit={handleUpload} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Notice Title *</label>
                  <input value={uploadForm.title} onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5c38] focus:ring-2 focus:ring-[#1a5c38]/10 transition-all text-gray-900"
                    placeholder="e.g. Landslide Alert on NH-10" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Category *</label>
                    <div className="relative text-gray-800">
                      <select value={uploadForm.category} onChange={e => setUploadForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5c38] focus:ring-2 focus:ring-[#1a5c38]/10 appearance-none bg-white text-gray-800 font-medium">
                        {["Landslide","Flood","Travel","Rainfall","Snowfall","Earthquake","Highway","General"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Severity *</label>
                    <div className="relative text-gray-800">
                      <select value={uploadForm.severity} onChange={e => setUploadForm(p => ({ ...p, severity: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5c38] focus:ring-2 focus:ring-[#1a5c38]/10 appearance-none bg-white text-gray-800 font-medium">
                        {["Low","Medium","High","Critical"].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Affected Areas *</label>
                  <input value={uploadForm.affectedAreas} onChange={e => setUploadForm(p => ({ ...p, affectedAreas: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5c38] focus:ring-2 focus:ring-[#1a5c38]/10 text-gray-900"
                    placeholder="e.g. North Sikkim, Mangan, NH-10" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Notice Content</label>
                  <textarea value={uploadForm.content} onChange={e => setUploadForm(p => ({ ...p, content: e.target.value }))} rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a5c38] focus:ring-2 focus:ring-[#1a5c38]/10 resize-vertical text-gray-900"
                    placeholder="Write the full notice content here..." />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button type="submit" disabled={uploading}
                    className="bg-[#1a5c38] hover:bg-[#2d7a50] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md">
                    {uploading ? "Uploading..." : "Publish Notice"}
                  </button>
                  <label className="cursor-pointer border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all ml-auto mr-2">
                     PDF or Image
                    <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                  <button type="button" onClick={() => { setUploadForm({ title: "", content: "", category: "General", severity: "Medium", affectedAreas: "" }); setFilePreview(null); setFileType(null); setFile(null); }}
                    className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all">
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Panel */}
            <div className="hidden lg:flex lg:flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">File Preview</h2>
              <p className="text-gray-500 text-sm mb-6">Preview of your selected file.</p>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 min-h-[500px] flex items-center justify-center overflow-hidden relative">
                {filePreview ? (
                  fileType === 'image' ? (
                    <img src={filePreview} className="max-w-full max-h-full object-contain" alt="File Preview" />
                  ) : (
                    <iframe src={`${filePreview}#toolbar=0`} className="w-full h-full border-none" title="PDF Preview" />
                  )
                ) : (
                  <div className="text-center text-gray-400 p-8">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="font-medium text-gray-500 mb-1">No file selected</p>
                    <p className="text-sm">Upload a PDF or image to preview it here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* MY NOTICES TAB */}
          {activeTab === "notices" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Notices</h2>
                  <p className="text-gray-500 text-sm mt-1">{activeNotices.length} active · {notices.length} total</p>
                </div>
                <button onClick={() => setActiveTab("upload")}
                  className="bg-[#1a5c38] hover:bg-[#2d7a50] text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shadow-md">
                  + Upload New
                </button>
              </div>

              {loadingNotices ? (
                <div className="text-center text-gray-400 py-16">Loading notices...</div>
              ) : notices.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <p className="font-bold text-gray-700 mb-1">No notices uploaded yet</p>
                  <p className="text-gray-400 text-sm mb-4">Upload your first notice to inform travellers.</p>
                  <button onClick={() => setActiveTab("upload")} className="bg-[#1a5c38] text-white font-semibold px-6 py-2.5 rounded-lg text-sm">Upload Notice</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map(n => (
                    <div key={n._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-gray-600">{DEPT_LABEL[official?.department]} · {new Date(n.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${SEVERITY_COLORS[n.severity]}`}>{n.severity}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${daysLeft(n.expiresAt) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {daysLeft(n.expiresAt) > 0 ? `Expires in ${daysLeft(n.expiresAt)} days` : "Expired"}
                          </span>
                        </div>
                      </div>
                      <div className="px-5 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-1">{n.title}</h4>
                            {n.affectedAreas && <p className="text-xs text-[#1a5c38] font-semibold mb-2">Affected: {n.affectedAreas}</p>}
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{n.content}</p>
                            {n.attachmentUrl && (
                              <button onClick={() => setViewAttachmentUrl(n.attachmentUrl)}
                                 className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#1a5c38] hover:text-[#2d7a50] hover:underline bg-[#e8f5ee] px-3 py-1.5 rounded-md transition-colors w-fit border-none cursor-pointer">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                View Attachment
                              </button>
                            )}
                          </div>
                          <button onClick={() => setDeleteConfirm(n._id)}
                            className="flex-shrink-0 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all font-semibold" title="Delete notice">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="max-w-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-[#1a5c38] px-6 py-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                    {official?.name?.[0] || "G"}
                  </div>
                  <h3 className="text-white font-bold text-xl">{official?.name}</h3>
                  <p className="text-white/70 text-sm mt-1">{official?.designation}</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { label: "Email", value: official?.email },
                    { label: "Department", value: DEPT_LABEL[official?.department] },
                    { label: "Designation", value: official?.designation },
                  ].map((row, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{row.label}</span>
                      <span className="text-sm font-semibold text-gray-800">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-100">
                  <button onClick={handleLogout}
                    className="w-full border-2 border-red-200 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-all">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Notice?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The notice will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-300 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {viewAttachmentUrl && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setViewAttachmentUrl(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Attachment Preview</h3>
              <div className="flex items-center gap-2">
                <a
                  href={viewAttachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#1a5c38] hover:text-[#2d7a50] hover:underline"
                >
                  Open in New Tab
                </a>
                <button onClick={() => setViewAttachmentUrl(null)} className="text-gray-500 hover:text-gray-700 font-bold text-xl ml-2">✕</button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
              {viewAttachmentUrl.toLowerCase().match(/\.(jpg|jpeg|png|webp|avif)$/i) || viewAttachmentUrl.toLowerCase().includes('image') ? (
                <img src={viewAttachmentUrl} className="max-w-full max-h-full object-contain" alt="Notice Attachment" />
              ) : (
                <iframe
                  src={viewAttachmentUrl}
                  className="w-full h-full border-none rounded-lg bg-white"
                  title="PDF Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
