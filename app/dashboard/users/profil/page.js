"use client";

import { useState, useEffect, useRef } from "react";
import { UserCircle, IdCard, School, BookUser } from "lucide-react";
import Navbar from "@/app/components/dashboard/Navbar";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function ProfilUserPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        namalengkap: "",
        fakultas: "",
        prodi: "",
        nim: "",
        foto: "",
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [userId, setUserId] = useState(null); // <-- Gunakan state
    const fileInputRef = useRef();

    // Ambil userId dari localStorage di client
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const userLogin = JSON.parse(localStorage.getItem("userLogin"));
                setUserId(userLogin?._id || null);
            } catch {
                setUserId(null);
            }
        }
    }, []);

    // Fetch profil user
    useEffect(() => {
        if (!userId) return;
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/users/${userId}`);
                const data = await res.json();
                setProfile(data);
                setForm({
                    namalengkap: data.namalengkap || "",
                    fakultas: data.fakultas || "",
                    prodi: data.prodi || "",
                    nim: data.nim || "",
                    foto: data.foto || "",
                });
            } catch {
                setMsg("Gagal mengambil data profil.");
            }
            setLoading(false);
        };
        fetchProfile();
    }, [userId]);

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle upload foto
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("foto", file);
        setLoading(true);
        setMsg("");
        try {
            const res = await fetch(`/api/users/${userId}/foto`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setForm((prev) => ({ ...prev, foto: data.foto }));
                setProfile((prev) => ({ ...prev, foto: data.foto }));
                setMsg("Foto berhasil diupload.");
            } else {
                setMsg(data.msg || "Gagal upload foto.");
            }
        } catch {
            setMsg("Gagal upload foto.");
        }
        setLoading(false);
    };

    // Handle submit edit profil
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    namalengkap: form.namalengkap,
                    fakultas: form.fakultas,
                    prodi: form.prodi,
                    nim: form.nim,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setProfile((prev) => ({
                    ...prev,
                    namalengkap: form.namalengkap,
                    fakultas: form.fakultas,
                    prodi: form.prodi,
                    nim: form.nim,
                }));
                setEditMode(false);
                setMsg("Profil berhasil diupdate.");
            } else {
                setMsg(data.msg || "Gagal update profil.");
            }
        } catch {
            setMsg("Gagal update profil.");
        }
        setLoading(false);
    };

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-300">
                Silakan login terlebih dahulu.
            </div>
        );
    }

    if (userId === null) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-300">
                Memuat profil...
            </div>
        );
    }
    
  if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-300">
                Memuat profil...
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
            <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="user" />
            <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}>
                <div className="max-w-lg mx-auto bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-700 mt-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-4 border-4 border-indigo-400 shadow">
                            {form.foto ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={form.foto} alt="Foto Profil" className="object-cover w-full h-full" />
                            ) : (
                                <UserCircle className="w-24 h-24 text-indigo-400" />
                            )}
                        </div>
                        <button
                            type="button"
                            className="text-xs text-indigo-300 underline mb-2"
                            onClick={() => fileInputRef.current.click()}
                            disabled={loading}
                        >
                            Ganti Foto
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <h2 className="text-2xl font-bold text-indigo-200 mb-1">
                            {profile.namalengkap || profile.username}
                        </h2>
                        <div className="text-gray-400 text-sm">Profil Mahasiswa</div>
                    </div>
                    {editMode ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex items-center gap-3">
                                <IdCard className="w-6 h-6 text-indigo-300" />
                                <span className="text-gray-200 font-semibold w-32">NIM</span>
                                <input
                                    type="text"
                                    name="nim"
                                    value={form.nim || ""}
                                    onChange={handleChange}
                                    className="flex-1 rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <School className="w-6 h-6 text-indigo-300" />
                                <span className="text-gray-200 font-semibold w-32">Fakultas</span>
                                <input
                                    type="text"
                                    name="fakultas"
                                    value={form.fakultas || ""}
                                    onChange={handleChange}
                                    className="flex-1 rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <BookUser className="w-6 h-6 text-indigo-300" />
                                <span className="text-gray-200 font-semibold w-32">Prodi</span>
                                <input
                                    type="text"
                                    name="prodi"
                                    value={form.prodi || ""}
                                    onChange={handleChange}
                                    className="flex-1 rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-200 font-semibold w-32">Nama Lengkap</span>
                                <input
                                    type="text"
                                    name="namalengkap"
                                    value={form.namalengkap || ""}
                                    onChange={handleChange}
                                    className="flex-1 rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                />
                            </div>
                            {msg && <div className="text-center text-sm text-indigo-300">{msg}</div>}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                                    onClick={() => setEditMode(false)}
                                    disabled={loading}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                                    disabled={loading}
                                >
                                    {loading ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <IdCard className="w-6 h-6 text-indigo-300" />
                                <span className="text-gray-200 font-semibold w-32">NIM</span>
                                <span className="text-gray-300">{profile.nim || "-"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <School className="w-6 h-6 text-indigo-300" />
                                <span className="text-gray-200 font-semibold w-32">Fakultas</span>
                                <span className="text-gray-300">{profile.fakultas || "-"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <BookUser className="w-6 h-6 text-indigo-300" />
                                <span className="text-gray-200 font-semibold w-32">Prodi</span>
                                <span className="text-gray-300">{profile.prodi || "-"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-200 font-semibold w-32">Nama Lengkap</span>
                                <span className="text-gray-300">{profile.namalengkap || "-"}</span>
                            </div>
                            {msg && <div className="text-center text-sm text-indigo-300">{msg}</div>}
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit Profil
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}