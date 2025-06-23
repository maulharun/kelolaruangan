"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Building2, Send, UserCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/app/components/dashboard/Navbar";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function BookingRuanganPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        room: "",
        tanggal: "",
        waktuMulai: "",
        waktuSelesai: "",
        keterangan: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [profilLengkap, setProfilLengkap] = useState(false);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Fetch ruangan dari API
        const fetchRooms = async () => {
            try {
                const res = await fetch("/api/ruangan");
                const data = await res.json();
                setRooms(data);
            } catch {
                setRooms([]);
            }
        };
        fetchRooms();

        // Ambil _id user dari localStorage
        let userLogin = null;
        let userId = null;
        if (typeof window !== "undefined") {
            try {
                userLogin = JSON.parse(localStorage.getItem("userLogin"));
                userId = userLogin?._id;
            } catch { }
        }
        if (!userId) {
            setProfile(null);
            setProfilLengkap(false);
            return;
        }

        // Fetch data user terbaru dari API
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/users/${userId}`);
                const data = await res.json();
                setProfile(data);

                // Cek kelengkapan profil
                if (
                    data &&
                    data.namalengkap &&
                    data.fakultas &&
                    data.prodi &&
                    data.nim
                ) {
                    setProfilLengkap(true);
                } else {
                    setProfilLengkap(false);
                }
            } catch {
                setProfile(null);
                setProfilLengkap(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!profilLengkap) {
        setError("Lengkapi profil Anda terlebih dahulu sebelum mengajukan pemakaian ruangan.");
        return;
    }
    if (!form.room || !form.tanggal || !form.waktuMulai || !form.waktuSelesai) {
        setError("Semua field wajib diisi.");
        return;
    }

    // Kirim data booking ke API beserta data user
    try {
        const res = await fetch("/api/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                userId: profile?._id,
                namaPeminjam: profile?.namalengkap,
                nim: profile?.nim,
                prodi: profile?.prodi,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            setSuccess(data.msg || "Pengajuan pemakaian ruangan berhasil dikirim!");
            setForm({
                room: "",
                tanggal: "",
                waktuMulai: "",
                waktuSelesai: "",
                keterangan: "",
            });
        } else {
            setError(data.msg || "Gagal mengajukan booking.");
        }
    } catch {
        setError("Terjadi kesalahan pada server.");
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
            <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="user" />
            <main
                className={`pt-20 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}
            >
                <div className="max-w-xl mx-auto bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-700 mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Building2 className="w-8 h-8 text-indigo-400" />
                        <h2 className="text-2xl font-bold text-indigo-200 tracking-wide">
                            Pengajuan Pemakaian Ruangan
                        </h2>
                    </div>
                    {!profilLengkap && (
                        <div className="flex items-center gap-2 bg-yellow-100/10 border border-yellow-400/30 text-yellow-300 rounded-lg px-4 py-3 mb-6">
                            <AlertTriangle className="w-5 h-5" />
                            <span>
                                Anda harus melengkapi profil (Nama Lengkap, Fakultas, Prodi, NIM) sebelum mengajukan pemakaian ruangan.
                            </span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-gray-200 font-semibold mb-1 flex items-center gap-2">
                                <Building2 className="w-5 h-5" title="Ruangan" /> Pilih Ruangan
                            </label>
                            <select
                                name="room"
                                value={form.room}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-gray-900 border border-gray-600 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={!profilLengkap}
                                required
                            >
                                <option value="">-- Pilih Ruangan --</option>
                                {rooms.map((room) => (
                                    <option key={room._id} value={room.namaruangan}>
                                        {room.namaruangan} ({room.lokasi}, Kapasitas: {room.kapasitas})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-200 font-semibold mb-1 flex items-center gap-2">
                                <Calendar className="w-5 h-5" title="Tanggal" /> Tanggal
                            </label>
                            <input
                                type="date"
                                name="tanggal"
                                value={form.tanggal}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-gray-900 border border-gray-600 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={!profilLengkap}
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-gray-200 font-semibold mb-1 flex items-center gap-2">
                                    <Clock className="w-5 h-5" title="Waktu Mulai" /> Waktu Mulai
                                </label>
                                <input
                                    type="time"
                                    name="waktuMulai"
                                    value={form.waktuMulai}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-gray-900 border border-gray-600 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    disabled={!profilLengkap}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-gray-200 font-semibold mb-1 flex items-center gap-2">
                                    <Clock className="w-5 h-5" title="Waktu Selesai" /> Waktu Selesai
                                </label>
                                <input
                                    type="time"
                                    name="waktuSelesai"
                                    value={form.waktuSelesai}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-gray-900 border border-gray-600 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    disabled={!profilLengkap}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-200 font-semibold mb-1 flex items-center gap-2">
                                <UserCircle className="w-5 h-5" title="Keterangan" /> Keterangan (Opsional)
                            </label>
                            <textarea
                                name="keterangan"
                                value={form.keterangan}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-gray-900 border border-gray-600 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={2}
                                disabled={!profilLengkap}
                                placeholder="Contoh: Untuk rapat divisi, seminar, dll"
                            />
                        </div>
                        {error && (
                            <div className="text-red-400 text-sm text-center flex items-center gap-2 justify-center">
                                <AlertTriangle className="w-4 h-4" title="Error" /> {error}
                            </div>
                        )}
                        {success && (
                            <div className="text-green-400 text-sm text-center flex items-center gap-2 justify-center">
                                <Send className="w-4 h-4" title="Sukses" /> {success}
                            </div>
                        )}
                        <button
                            type="submit"
                            aria-label="Ajukan Pemakaian"
                            disabled={!profilLengkap}
                            className={`w-full flex items-center justify-center gap-2 py-2 rounded-full font-bold shadow-lg transition-all duration-200
            ${profilLengkap
                                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-gray-700 text-white hover:from-gray-700 hover:to-indigo-600 hover:scale-105"
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <Send className="w-5 h-5" title="Ajukan" />
                            Ajukan Pemakaian
                        </button>
                    </form>
                    {!profilLengkap && (
                        <div className="mt-6 text-center text-sm text-indigo-200">
                            <UserCircle className="inline w-5 h-5 mr-1" />
                            <span>
                                Lengkapi <a href="/dashboard/users/profil" className="underline text-indigo-300 hover:text-indigo-400">profil Anda</a> untuk dapat mengajukan ruangan.
                            </span>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}