"use client";

import { useState, useEffect } from "react";
import { Bell, Search, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/app/components/dashboard/Navbar";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function BookingValidasiPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [alasanTolak, setAlasanTolak] = useState("");
    const [rejectLoading, setRejectLoading] = useState(false);

    // Fetch bookings
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/booking");
            const data = await res.json();
            setBookings(data);
        } catch {
            setBookings([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(
        (b) =>
            (b.room || "").toLowerCase().includes(search.toLowerCase()) ||
            (b.namaPeminjam || "").toLowerCase().includes(search.toLowerCase()) ||
            (b.nim || "").toLowerCase().includes(search.toLowerCase()) ||
            (b.prodi || "").toLowerCase().includes(search.toLowerCase()) ||
            (b.status || "").toLowerCase().includes(search.toLowerCase())
    );

    // Validasi booking
    const handleApprove = async (id) => {
        if (!window.confirm("Setujui booking ini?")) return;
        const res = await fetch("/api/booking/validate", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: "approved", alasanTolak: "" }),
        });
        if (res.ok) {
            fetchBookings();
        } else {
            alert("Gagal menyetujui booking.");
        }
    };

    // Tampilkan modal tolak
    const handleReject = (id) => {
        setRejectId(id);
        setAlasanTolak("");
        setShowReject(true);
    };

    // ...existing code...

    // Submit tolak
    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        setRejectLoading(true);
        const res = await fetch("/api/booking/validate", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: rejectId, status: "rejected", alasanTolak }),
        });
        setRejectLoading(false);
        setShowReject(false);
        if (res.ok) {
            fetchBookings();
        } else {
            alert("Gagal menolak booking.");
        }
    };

    // ...existing code...

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
            <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="admin" />
            <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}>
                <div className="max-w-5xl mx-auto bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-700 mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-7 h-7 text-indigo-400" />
                        <h2 className="text-2xl font-bold text-indigo-200 tracking-wide">
                            Validasi Booking Ruangan
                        </h2>
                    </div>
                    <div className="mb-6 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari ruangan, nama, NIM, prodi, status..."
                            className="w-full rounded-lg bg-gray-900 border border-gray-600 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {loading ? (
                        <div className="text-gray-400 text-center py-8">Memuat data...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-200">
                                <thead>
                                    <tr className="bg-gray-900/80">
                                        <th className="py-2 px-4 text-left">Ruangan</th>
                                        <th className="py-2 px-4 text-left">Tanggal</th>
                                        <th className="py-2 px-4 text-left">Waktu</th>
                                        <th className="py-2 px-4 text-left">Peminjam</th>
                                        <th className="py-2 px-4 text-left">Prodi</th>
                                        <th className="py-2 px-4 text-left">Status</th>
                                        <th className="py-2 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-400">
                                                Tidak ada booking ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredBookings.map((b) => (
                                            <tr key={b._id} className="border-b border-gray-700 hover:bg-gray-900/60">
                                                <td className="py-2 px-4">{b.room}</td>
                                                <td className="py-2 px-4">{b.tanggal}</td>
                                                <td className="py-2 px-4">{b.waktuMulai} - {b.waktuSelesai}</td>
                                                <td className="py-2 px-4">{b.namaPeminjam} ({b.nim})</td>
                                                <td className="py-2 px-4">{b.prodi}</td>
                                                <td className="py-2 px-4 capitalize">
                                                    {b.status === "pending" && <span className="text-yellow-400">Pending</span>}
                                                    {b.status === "approved" && <span className="text-green-400">Disetujui</span>}
                                                    {b.status === "rejected" && (
                                                        <span className="text-red-400" title={b.alasanTolak}>
                                                            Ditolak
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 flex gap-2 justify-center">
                                                    {b.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(b._id)}
                                                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
                                                            >
                                                                <CheckCircle2 className="w-4 h-4" /> Setujui
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(b._id)}
                                                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition"
                                                            >
                                                                <XCircle className="w-4 h-4" /> Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                    {b.status !== "pending" && b.status}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* Modal Tolak */}
                {showReject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <form
                            onSubmit={handleRejectSubmit}
                            className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-lg"
                        >
                            <h3 className="text-lg font-bold text-red-300 mb-4">Tolak Booking</h3>
                            <div className="mb-3">
                                <label className="block text-gray-300 text-sm mb-1">Alasan Penolakan</label>
                                <textarea
                                    className="w-full rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                    value={alasanTolak}
                                    onChange={(e) => setAlasanTolak(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowReject(false)}
                                    className="px-4 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                                    disabled={rejectLoading}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                                    disabled={rejectLoading}
                                >
                                    {rejectLoading ? "Menyimpan..." : "Tolak"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}