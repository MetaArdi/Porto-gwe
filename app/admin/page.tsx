"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  FolderKanban, 
  Share2, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Code2,
  Eye,
  Crop,
  Globe,
  Image as ImageIcon
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"about" | "settings" | "techStack" | "projects" | "experiences" | "educations" | "achievements" | "contacts">("about");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Edit State for modals/subforms
  const [editingTech, setEditingTech] = useState<any>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [editingAchievement, setEditingAchievement] = useState<any>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      const json = await res.json();
      if (json && !json.error) {
        setData(json);
      }
    } catch (err) {
      showToast("Gagal memuat data portofolio", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const saveDataDirectly = async (newData: any) => {
    setData(newData);
    try {
      setSaving(true);
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      const result = await res.json();
      if (res.ok) {
        showToast("Perubahan tersimpan & langsung aktif di halaman utama!", "success");
      } else {
        showToast(result.error || "Gagal menyimpan perubahan", "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan saat menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (!data) return;
    await saveDataDirectly(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      showToast("Mengunggah gambar...", "success");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.url) {
        callback(result.url);
        showToast("Gambar berhasil diunggah!", "success");
      } else {
        showToast("Gagal mengunggah gambar", "error");
      }
    } catch (err) {
      showToast("Kesalahan saat mengunggah file", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-cyan-400 font-bold text-xl animate-pulse">Memuat Admin Dashboard...</div>
      </div>
    );
  }

  // Frame Preview Classes helper
  const avatarAspectRatio = data?.about?.avatarAspectRatio || "3/4";
  const avatarPosition = data?.about?.avatarPosition || "top";
  const avatarFit = data?.about?.avatarFit || "cover";
  const avatarSize = data?.about?.avatarSize || "medium";

  const previewAspectClass = 
    avatarAspectRatio === "1/1" ? "aspect-[1/1]" :
    avatarAspectRatio === "4/5" ? "aspect-[4/5]" :
    avatarAspectRatio === "auto" ? "h-auto" :
    "aspect-[3/4]";

  const previewFitClass = avatarFit === "contain" ? "object-contain" : "object-cover";
  const previewPosClass = avatarPosition === "bottom" ? "object-bottom" : avatarPosition === "center" ? "object-center" : "object-top";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
          toast.type === "success" 
            ? "bg-neutral-900 border-cyan-400 text-cyan-300" 
            : "bg-neutral-900 border-red-500 text-red-400"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" /> Lihat Website Utama
            </Link>
            <h1 className="text-xl font-black tracking-wide text-white">
              Admin <span className="text-cyan-400">Dashboard</span>
            </h1>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-cyan-400/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </header>

      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <nav className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800 space-y-1">
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "settings" ? "bg-cyan-400 text-black shadow-md" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4" /> Website, Favicon & Brand
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "about" ? "bg-cyan-400 text-black shadow-md" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" /> Profil & Bio
            </button>

            <button
              onClick={() => setActiveTab("techStack")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "techStack" ? "bg-cyan-400 text-black shadow-md" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Code2 className="w-4 h-4" /> Tech Stack
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "projects" ? "bg-cyan-400 text-black shadow-md" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <FolderKanban className="w-4 h-4" /> My Projects
            </button>

            <button
              onClick={() => setActiveTab("experiences")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "experiences" ? "bg-cyan-400 text-black shadow-md" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4" /> Experiences
            </button>

            <button
              onClick={() => setActiveTab("educations")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "educations" ? "bg-cyan-400 text-black shadow-md" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Education
            </button>

            <button
              onClick={() => setActiveTab("achievements")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "achievements" ? "bg-cyan-400 text-black shadow-md" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Trophy className="w-4 h-4" /> Achievements
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeTab === "contacts" ? "bg-cyan-400 text-black shadow-md" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <Share2 className="w-4 h-4" /> Kontak & Socials
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-neutral-900 p-8 rounded-2xl border border-neutral-800 min-h-[600px]">
          
          {/* TAB: WEBSITE, FAVICON & BRAND SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-cyan-400 border-b border-neutral-800 pb-4">
                Kelola Website, Favicon & Brand Navbar
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">Nama Brand di Navbar (e.g. Meta Ardi Setiawan)</label>
                  <input
                    type="text"
                    value={data?.siteSettings?.brandName || data?.about?.name || ""}
                    onChange={(e) => setData({
                      ...data,
                      siteSettings: { ...(data.siteSettings || {}), brandName: e.target.value }
                    })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                    placeholder="Meta Ardi Setiawan"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Teks ini akan langsung muncul di bagian tengah Navbar melayang.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">Judul Website (Browser Tab Title)</label>
                  <input
                    type="text"
                    value={data?.siteSettings?.title || ""}
                    onChange={(e) => setData({
                      ...data,
                      siteSettings: { ...(data.siteSettings || {}), title: e.target.value }
                    })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                    placeholder="Meta Ardi Setiawan - Portfolio"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Judul yang akan tampil di tab browser pengunjung & hasil pencarian Google.</p>
                </div>

                <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-cyan-400" /> Favicon Icon Website (Ikon di Tab Browser)
                  </h3>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl border-2 border-cyan-400 bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-cyan-400/20">
                      <img 
                        src={data?.siteSettings?.faviconUrl || "/icon.png"} 
                        alt="Favicon Preview" 
                        className="w-10 h-10 object-contain"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition shadow-md">
                        <Upload className="w-4 h-4" /> Unggah Favicon Baru
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, (url) => saveDataDirectly({
                            ...data,
                            siteSettings: { ...(data.siteSettings || {}), faviconUrl: url }
                          }))}
                        />
                      </label>
                      <input
                        type="text"
                        value={data?.siteSettings?.faviconUrl || ""}
                        onChange={(e) => setData({
                          ...data,
                          siteSettings: { ...(data.siteSettings || {}), faviconUrl: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs focus:border-cyan-400 outline-none"
                        placeholder="/icon.png atau URL Gambar"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">Deskripsi SEO Website</label>
                  <textarea
                    rows={3}
                    value={data?.siteSettings?.description || ""}
                    onChange={(e) => setData({
                      ...data,
                      siteSettings: { ...(data.siteSettings || {}), description: e.target.value }
                    })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none resize-none leading-relaxed"
                    placeholder="Deskripsi singkat website Anda untuk Google..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: PROFIL & BIO */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-cyan-400 border-b border-neutral-800 pb-4">
                Kelola Profil & Bingkai Foto
              </h2>

              {/* Photo Upload & Live Frame Preview */}
              <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Glowing Frame Preview */}
                  <div className="relative group shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-sky-300 rounded-3xl blur-md opacity-75"></div>
                    <div className={`relative w-48 ${previewAspectClass} rounded-3xl overflow-hidden border-4 border-cyan-400 bg-neutral-900 shadow-2xl shadow-cyan-500/20`}>
                      <img 
                        src={data?.about?.avatarUrl || "/uploads/1786141730791-IMG_20260731_014555.png"} 
                        alt="Profile Avatar" 
                        className={`w-full h-full ${previewFitClass} ${previewPosClass}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 flex-1 w-full text-center md:text-left">
                    <div>
                      <h3 className="font-bold text-white text-lg flex items-center justify-center md:justify-start gap-2">
                        <Crop className="w-5 h-5 text-cyan-400" /> Foto Profil & Bingkai
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">Unggah foto baru dan atur ukuran bingkai agar foto pas di tampilan utama.</p>
                    </div>

                    <label className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition shadow-lg shadow-cyan-400/20">
                      <Upload className="w-4 h-4" /> Unggah Foto Baru
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, (url) => saveDataDirectly({
                          ...data,
                          about: { ...data.about, avatarUrl: url }
                        }))}
                      />
                    </label>

                    {/* Frame Controls Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-900">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1.5">Bentuk Bingkai (Aspect Ratio)</label>
                        <select
                          value={avatarAspectRatio}
                          onChange={(e) => saveDataDirectly({
                            ...data,
                            about: { ...data.about, avatarAspectRatio: e.target.value }
                          })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-white focus:border-cyan-400 outline-none"
                        >
                          <option value="3/4">Portrait Pas Foto (3:4) - Rekomendasi</option>
                          <option value="4/5">Portrait (4:5)</option>
                          <option value="1/1">Persegi (1:1)</option>
                          <option value="auto">Asli (Mengikuti Gambar)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1.5">Fokus Foto (Posisi Wajah)</label>
                        <select
                          value={avatarPosition}
                          onChange={(e) => saveDataDirectly({
                            ...data,
                            about: { ...data.about, avatarPosition: e.target.value }
                          })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-white focus:border-cyan-400 outline-none"
                        >
                          <option value="top">Atas (Fokus Kepala & Wajah)</option>
                          <option value="center">Tengah (Center)</option>
                          <option value="bottom">Bawah (Bottom)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1.5">Ukuran Bingkai di Tampilan Utama</label>
                        <select
                          value={avatarSize}
                          onChange={(e) => saveDataDirectly({
                            ...data,
                            about: { ...data.about, avatarSize: e.target.value }
                          })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-white focus:border-cyan-400 outline-none"
                        >
                          <option value="medium">Sedang (Standard)</option>
                          <option value="large">Besar</option>
                          <option value="small">Kecil</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 mb-1.5">Mode Pemotongan Bingkai</label>
                        <select
                          value={avatarFit}
                          onChange={(e) => saveDataDirectly({
                            ...data,
                            about: { ...data.about, avatarFit: e.target.value }
                          })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-white focus:border-cyan-400 outline-none"
                        >
                          <option value="cover">Potong Rapi Pas Bingkai (Cover)</option>
                          <option value="contain">Utuh Tanpa Terpotong (Contain)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">Nama Tampilan</label>
                  <input
                    type="text"
                    value={data?.about?.name || ""}
                    onChange={(e) => setData({ ...data, about: { ...data.about, name: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    value={data?.about?.fullName || ""}
                    onChange={(e) => setData({ ...data, about: { ...data.about, fullName: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Tahun Kelahiran</label>
                <input
                  type="text"
                  value={data?.about?.birthYear || ""}
                  onChange={(e) => setData({ ...data, about: { ...data.about, birthYear: e.target.value } })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Animated Words (Dipisah Koma)</label>
                <input
                  type="text"
                  value={data?.about?.words ? data.about.words.join(", ") : ""}
                  onChange={(e) => setData({
                    ...data,
                    about: { 
                      ...data.about, 
                      words: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                    }
                  })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Bio Teks</label>
                <textarea
                  rows={5}
                  value={data?.about?.bio || ""}
                  onChange={(e) => setData({ ...data, about: { ...data.about, bio: e.target.value } })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">URL Google Drive CV</label>
                <input
                  type="text"
                  value={data?.about?.cvUrl || ""}
                  onChange={(e) => setData({ ...data, about: { ...data.about, cvUrl: e.target.value } })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TECH STACK */}
          {activeTab === "techStack" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-2xl font-black text-cyan-400">Kelola Tech Stack</h2>
                <button
                  onClick={() => setEditingTech({ id: String(Date.now()), name: "", category: "Frontend", iconUrl: "" })}
                  className="flex items-center gap-2 bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl hover:bg-cyan-300 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Tech Stack
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data?.techStack?.map((tech: any, idx: number) => (
                  <div key={tech.id || idx} className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800 gap-4">
                    <div className="flex items-center gap-3">
                      {tech.iconUrl && (
                        <img src={tech.iconUrl} alt={tech.name} className="w-8 h-8 object-contain rounded" />
                      )}
                      <div>
                        <h3 className="font-bold text-white text-sm">{tech.name}</h3>
                        <p className="text-xs text-neutral-400">{tech.category || "General"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingTech(tech)}
                        className="p-2 bg-neutral-800 hover:bg-cyan-400 hover:text-black rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = data.techStack.filter((t: any) => t.id !== tech.id);
                          saveDataDirectly({ ...data, techStack: updated });
                        }}
                        className="p-2 bg-neutral-800 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingTech && (
                <div className="p-6 bg-neutral-950 rounded-2xl border border-cyan-400/50 space-y-4">
                  <h3 className="font-bold text-cyan-400 text-lg">
                    {data?.techStack?.some((t: any) => t.id === editingTech.id) ? "Edit Tech Stack" : "Tambah Tech Stack Baru"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Nama Teknologi (e.g. React, Python)</label>
                      <input
                        type="text"
                        value={editingTech.name}
                        onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Kategori (e.g. Frontend, Backend, Language, Styling)</label>
                      <input
                        type="text"
                        value={editingTech.category || ""}
                        onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">Icon URL / Upload Logo</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={editingTech.iconUrl || ""}
                        onChange={(e) => setEditingTech({ ...editingTech, iconUrl: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                        placeholder="/assets/react.png"
                      />
                      <label className="bg-neutral-800 hover:bg-neutral-700 px-4 flex items-center justify-center rounded-xl cursor-pointer text-xs font-bold shrink-0">
                        Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, (url) => setEditingTech({ ...editingTech, iconUrl: url }))}
                        />
                      </label>
                    </div>

                    {/* LIVE PREVIEW */}
                    {editingTech.iconUrl && (
                      <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-cyan-400/40 w-fit">
                        <img src={editingTech.iconUrl} alt="Preview" className="w-10 h-10 object-contain rounded" />
                        <span className="text-xs text-cyan-300 font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Live Preview Logo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setEditingTech(null)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const exists = (data.techStack || []).some((t: any) => t.id === editingTech.id);
                        const updatedList = exists
                          ? data.techStack.map((t: any) => t.id === editingTech.id ? editingTech : t)
                          : [...(data.techStack || []), editingTech];
                        saveDataDirectly({ ...data, techStack: updatedList });
                        setEditingTech(null);
                      }}
                      className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black rounded-xl cursor-pointer"
                    >
                      Simpan Tech Stack
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-2xl font-black text-cyan-400">Kelola Projects</h2>
                <button
                  onClick={() => setEditingProject({ id: String(Date.now()), title: "", description: "", link: "", githubLink: "", imageUrl: "", tags: [] })}
                  className="flex items-center gap-2 bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl hover:bg-cyan-300 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Project
                </button>
              </div>

              {/* List Projects */}
              <div className="grid grid-cols-1 gap-4">
                {data?.projects?.map((proj: any, idx: number) => (
                  <div key={proj.id || idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800 gap-4">
                    <div className="flex items-center gap-4">
                      {proj.imageUrl && (
                        <img src={proj.imageUrl} alt={proj.title} className="w-16 h-12 object-cover rounded-lg shrink-0 border border-neutral-800" />
                      )}
                      <div>
                        <h3 className="font-bold text-white text-base">{proj.title}</h3>
                        <p className="text-xs text-neutral-400 line-clamp-1">{proj.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="p-2 bg-neutral-800 hover:bg-cyan-400 hover:text-black rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = data.projects.filter((p: any) => p.id !== proj.id);
                          saveDataDirectly({ ...data, projects: updated });
                        }}
                        className="p-2 bg-neutral-800 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Modal/Section for Add/Edit Project */}
              {editingProject && (
                <div className="p-6 bg-neutral-950 rounded-2xl border border-cyan-400/50 space-y-4">
                  <h3 className="font-bold text-cyan-400 text-lg">
                    {data?.projects?.some((p: any) => p.id === editingProject.id) ? "Edit Project" : "Tambah Project Baru"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Judul Project</label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Demo Link</label>
                      <input
                        type="text"
                        value={editingProject.link}
                        onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">GitHub Link</label>
                      <input
                        type="text"
                        value={editingProject.githubLink || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, githubLink: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Gambar URL / Upload</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProject.imageUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                        />
                        <label className="bg-neutral-800 hover:bg-neutral-700 px-4 flex items-center justify-center rounded-xl cursor-pointer text-xs font-bold shrink-0">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, (url) => setEditingProject({ ...editingProject, imageUrl: url }))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* LIVE PREVIEW */}
                  {editingProject.imageUrl && (
                    <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-cyan-400/40 w-fit">
                      <img src={editingProject.imageUrl} alt="Preview" className="w-20 h-14 object-cover rounded-lg border border-neutral-800" />
                      <span className="text-xs text-cyan-300 font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Live Preview Gambar Project</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">Deskripsi</label>
                    <textarea
                      rows={3}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const exists = data.projects.some((p: any) => p.id === editingProject.id);
                        const updatedList = exists
                          ? data.projects.map((p: any) => p.id === editingProject.id ? editingProject : p)
                          : [...data.projects, editingProject];
                        saveDataDirectly({ ...data, projects: updatedList });
                        setEditingProject(null);
                      }}
                      className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black rounded-xl cursor-pointer"
                    >
                      Simpan Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EXPERIENCES */}
          {activeTab === "experiences" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-2xl font-black text-cyan-400">Kelola Experiences</h2>
                <button
                  onClick={() => setEditingExperience({ id: String(Date.now()), role: "", organization: "", description: "", logoUrl: "", link: "" })}
                  className="flex items-center gap-2 bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl hover:bg-cyan-300 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Experience
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {data?.experiences?.map((exp: any, idx: number) => (
                  <div key={exp.id || idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800 gap-4">
                    <div className="flex items-center gap-4">
                      {exp.logoUrl && (
                        <img src={exp.logoUrl} alt={exp.organization} className="w-12 h-12 object-contain rounded-full bg-neutral-900 border border-neutral-800" />
                      )}
                      <div>
                        <h3 className="font-bold text-white text-base">{exp.role}</h3>
                        <p className="text-xs text-neutral-400">{exp.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingExperience(exp)}
                        className="p-2 bg-neutral-800 hover:bg-cyan-400 hover:text-black rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = data.experiences.filter((e: any) => e.id !== exp.id);
                          saveDataDirectly({ ...data, experiences: updated });
                        }}
                        className="p-2 bg-neutral-800 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingExperience && (
                <div className="p-6 bg-neutral-950 rounded-2xl border border-cyan-400/50 space-y-4">
                  <h3 className="font-bold text-cyan-400 text-lg">
                    {data?.experiences?.some((e: any) => e.id === editingExperience.id) ? "Edit Experience" : "Tambah Experience Baru"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Peran / Role</label>
                      <input
                        type="text"
                        value={editingExperience.role}
                        onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Organisasi / Perusahaan</label>
                      <input
                        type="text"
                        value={editingExperience.organization}
                        onChange={(e) => setEditingExperience({ ...editingExperience, organization: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Link Organisasi</label>
                      <input
                        type="text"
                        value={editingExperience.link || ""}
                        onChange={(e) => setEditingExperience({ ...editingExperience, link: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Logo URL / Upload</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingExperience.logoUrl || ""}
                          onChange={(e) => setEditingExperience({ ...editingExperience, logoUrl: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                        />
                        <label className="bg-neutral-800 hover:bg-neutral-700 px-4 flex items-center justify-center rounded-xl cursor-pointer text-xs font-bold shrink-0">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, (url) => setEditingExperience({ ...editingExperience, logoUrl: url }))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* LIVE PREVIEW */}
                  {editingExperience.logoUrl && (
                    <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-cyan-400/40 w-fit">
                      <img src={editingExperience.logoUrl} alt="Preview" className="w-10 h-10 object-contain rounded-full border border-neutral-800" />
                      <span className="text-xs text-cyan-300 font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Live Preview Logo Organisasi</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">Deskripsi</label>
                    <textarea
                      rows={3}
                      value={editingExperience.description}
                      onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setEditingExperience(null)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const exists = data.experiences.some((e: any) => e.id === editingExperience.id);
                        const updatedList = exists
                          ? data.experiences.map((e: any) => e.id === editingExperience.id ? editingExperience : e)
                          : [...data.experiences, editingExperience];
                        saveDataDirectly({ ...data, experiences: updatedList });
                        setEditingExperience(null);
                      }}
                      className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black rounded-xl cursor-pointer"
                    >
                      Simpan Experience
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EDUCATIONS */}
          {activeTab === "educations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-2xl font-black text-cyan-400">Kelola Education</h2>
                <button
                  onClick={() => setEditingEducation({ id: String(Date.now()), institution: "", field: "", logoUrl: "", link: "" })}
                  className="flex items-center gap-2 bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl hover:bg-cyan-300 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Education
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {data?.educations?.map((edu: any, idx: number) => (
                  <div key={edu.id || idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800 gap-4">
                    <div className="flex items-center gap-4">
                      {edu.logoUrl && (
                        <img src={edu.logoUrl} alt={edu.institution} className="w-12 h-12 object-contain rounded-full bg-neutral-900 border border-neutral-800" />
                      )}
                      <div>
                        <h3 className="font-bold text-white text-base">{edu.institution}</h3>
                        <p className="text-xs text-neutral-400">{edu.field}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingEducation(edu)}
                        className="p-2 bg-neutral-800 hover:bg-cyan-400 hover:text-black rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = data.educations.filter((e: any) => e.id !== edu.id);
                          saveDataDirectly({ ...data, educations: updated });
                        }}
                        className="p-2 bg-neutral-800 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingEducation && (
                <div className="p-6 bg-neutral-950 rounded-2xl border border-cyan-400/50 space-y-4">
                  <h3 className="font-bold text-cyan-400 text-lg">
                    {data?.educations?.some((e: any) => e.id === editingEducation.id) ? "Edit Education" : "Tambah Education Baru"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Institusi Sekolah / Universitas</label>
                      <input
                        type="text"
                        value={editingEducation.institution}
                        onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Jurusan / Tahun (e.g. Computer Science // 2024-2028)</label>
                      <input
                        type="text"
                        value={editingEducation.field}
                        onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Link Website Institusi</label>
                      <input
                        type="text"
                        value={editingEducation.link || ""}
                        onChange={(e) => setEditingEducation({ ...editingEducation, link: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Logo URL / Upload</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingEducation.logoUrl || ""}
                          onChange={(e) => setEditingEducation({ ...editingEducation, logoUrl: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                        />
                        <label className="bg-neutral-800 hover:bg-neutral-700 px-4 flex items-center justify-center rounded-xl cursor-pointer text-xs font-bold shrink-0">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, (url) => setEditingEducation({ ...editingEducation, logoUrl: url }))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* LIVE PREVIEW */}
                  {editingEducation.logoUrl && (
                    <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-cyan-400/40 w-fit">
                      <img src={editingEducation.logoUrl} alt="Preview" className="w-10 h-10 object-contain rounded-full border border-neutral-800" />
                      <span className="text-xs text-cyan-300 font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Live Preview Logo Institusi</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setEditingEducation(null)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const exists = data.educations.some((e: any) => e.id === editingEducation.id);
                        const updatedList = exists
                          ? data.educations.map((e: any) => e.id === editingEducation.id ? editingEducation : e)
                          : [...data.educations, editingEducation];
                        saveDataDirectly({ ...data, educations: updatedList });
                        setEditingEducation(null);
                      }}
                      className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black rounded-xl cursor-pointer"
                    >
                      Simpan Education
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ACHIEVEMENTS */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-2xl font-black text-cyan-400">Kelola Achievements</h2>
                <button
                  onClick={() => setEditingAchievement({ id: String(Date.now()), title: "", organization: "", logoUrl: "", link: "" })}
                  className="flex items-center gap-2 bg-cyan-400 text-black font-bold text-xs px-4 py-2 rounded-xl hover:bg-cyan-300 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Tambah Achievement
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {data?.achievements?.map((ach: any, idx: number) => (
                  <div key={ach.id || idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800 gap-4">
                    <div className="flex items-center gap-4">
                      {ach.logoUrl && (
                        <img src={ach.logoUrl} alt={ach.title} className="w-12 h-12 object-contain rounded-full bg-neutral-900 border border-neutral-800" />
                      )}
                      <div>
                        <h3 className="font-bold text-white text-base">{ach.title}</h3>
                        <p className="text-xs text-neutral-400">{ach.organization}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingAchievement(ach)}
                        className="p-2 bg-neutral-800 hover:bg-cyan-400 hover:text-black rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const updated = data.achievements.filter((a: any) => a.id !== ach.id);
                          saveDataDirectly({ ...data, achievements: updated });
                        }}
                        className="p-2 bg-neutral-800 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {editingAchievement && (
                <div className="p-6 bg-neutral-950 rounded-2xl border border-cyan-400/50 space-y-4">
                  <h3 className="font-bold text-cyan-400 text-lg">
                    {data?.achievements?.some((a: any) => a.id === editingAchievement.id) ? "Edit Achievement" : "Tambah Achievement Baru"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Judul Prestasi / Penghargaan</label>
                      <input
                        type="text"
                        value={editingAchievement.title}
                        onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Penyelenggara / Institusi</label>
                      <input
                        type="text"
                        value={editingAchievement.organization}
                        onChange={(e) => setEditingAchievement({ ...editingAchievement, organization: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Tautan Sertifikat / Info</label>
                      <input
                        type="text"
                        value={editingAchievement.link || ""}
                        onChange={(e) => setEditingAchievement({ ...editingAchievement, link: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">Logo URL / Upload</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingAchievement.logoUrl || ""}
                          onChange={(e) => setEditingAchievement({ ...editingAchievement, logoUrl: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                        />
                        <label className="bg-neutral-800 hover:bg-neutral-700 px-4 flex items-center justify-center rounded-xl cursor-pointer text-xs font-bold shrink-0">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileUpload(e, (url) => setEditingAchievement({ ...editingAchievement, logoUrl: url }))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* LIVE PREVIEW */}
                  {editingAchievement.logoUrl && (
                    <div className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl border border-cyan-400/40 w-fit">
                      <img src={editingAchievement.logoUrl} alt="Preview" className="w-10 h-10 object-contain rounded-full border border-neutral-800" />
                      <span className="text-xs text-cyan-300 font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> Live Preview Logo Prestasi</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setEditingAchievement(null)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        const exists = data.achievements.some((a: any) => a.id === editingAchievement.id);
                        const updatedList = exists
                          ? data.achievements.map((a: any) => a.id === editingAchievement.id ? editingAchievement : a)
                          : [...data.achievements, editingAchievement];
                        saveDataDirectly({ ...data, achievements: updatedList });
                        setEditingAchievement(null);
                      }}
                      className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black rounded-xl cursor-pointer"
                    >
                      Simpan Achievement
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CONTACTS & SOCIALS */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-cyan-400 border-b border-neutral-800 pb-4">
                Kelola Kontak & Social Media
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">Alamat Email Penerima Pesan Form</label>
                  <input
                    type="email"
                    value={data?.contacts?.email || ""}
                    onChange={(e) => setData({ ...data, contacts: { ...data.contacts, email: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                    placeholder="namaanda@gmail.com"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Pesan dari pengunjung di form "Contact Me" akan dikirimkan ke alamat email ini.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">Web3Forms Access Key (Opsional)</label>
                  <input
                    type="text"
                    value={data?.contacts?.web3formsKey || ""}
                    onChange={(e) => setData({ ...data, contacts: { ...data.contacts, web3formsKey: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                    placeholder="Masukkan Web3Forms Access Key jika ada"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Dapatkan key gratis dari web3forms.com untuk menerima email langsung tanpa membuka aplikasi email.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">Instagram URL</label>
                  <input
                    type="text"
                    value={data?.contacts?.instagram || ""}
                    onChange={(e) => setData({ ...data, contacts: { ...data.contacts, instagram: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">GitHub URL</label>
                  <input
                    type="text"
                    value={data?.contacts?.github || ""}
                    onChange={(e) => setData({ ...data, contacts: { ...data.contacts, github: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    value={data?.contacts?.linkedin || ""}
                    onChange={(e) => setData({ ...data, contacts: { ...data.contacts, linkedin: e.target.value } })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
