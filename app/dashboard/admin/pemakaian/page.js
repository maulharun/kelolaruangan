"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Building2, Clock, User, CheckCircle2 } from "lucide-react";
import Navbar from "@/app/components/dashboard/Navbar";
import Sidebar from "@/app/components/dashboard/Sidebar";

function getStatusColor(status) {
  if (status === "approved" || status === "diterima") return "text-green-400";
  if (status === "rejected" || status === "ditolak") return "text-red-400";
  if (status === "selesai") return "text-blue-400";
  return "text-yellow-300";
}

function getStatusLabel(status) {
  if (status === "approved" || status === "diterima") return "Diterima";
  if (status === "rejected" || status === "ditolak") return "Ditolak";
  if (status === "selesai") return "Selesai";
  return "Pending";
}

export default function PemakaianRuanganAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pemakaian, setPemakaian] = useState([]);
  const [tanggal, setTanggal] = useState(""); // Untuk filter tanggal
  const [loading, setLoading] = useState(false);

  // Ambil data booking dari API
  const fetchPemakaian = async () => {
    setLoading(true);
    let url = "/api/booking";
    if (tanggal) url += `?tanggal=${tanggal}`;
    const res = await fetch(url);
    const data = await res.json();
    setPemakaian(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPemakaian();
    // eslint-disable-next-line
  }, [tanggal]);

  // Tandai selesai
  const handleSetSelesai = async (id) => {
    const res = await fetch("/api/booking/validate", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "selesai" }),
    });
    if (res.ok) fetchPemakaian();
    else alert("Gagal menandai selesai.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
      <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="admin" />
      <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}>
        <div className="max-w-4xl mx-auto bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-700 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="w-7 h-7 text-indigo-400" />
            <h2 className="text-2xl font-bold text-indigo-200 tracking-wide">
              Data Pengelolaan Peminjaman Ruangan
            </h2>
          </div>
          <div className="mb-6 flex items-center gap-2">
            <label className="text-gray-300 text-sm">Filter Tanggal:</label>
            <input
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              className="rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
            />
            <button
              onClick={() => setTanggal("")}
              className="ml-2 px-3 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 text-xs"
            >
              Reset
            </button>
          </div>
          {loading ? (
            <div className="text-gray-400 text-center py-8">
              Memuat data...
            </div>
          ) : pemakaian.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              Tidak ada data peminjaman ruangan.
            </div>
          ) : (
            <ul className="space-y-4">
              {pemakaian.map((item) => (
                <li
                  key={item._id}
                  className="bg-gray-900/80 border border-indigo-700/30 rounded-lg p-5 flex flex-col md:flex-row md:items-center gap-3"
                >
                  <div className="flex items-center gap-2 min-w-[160px]">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <span className="font-semibold text-indigo-200">{item.room}</span>
                  </div>
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 text-gray-200">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-indigo-300" />
                      <span>{item.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-300" />
                      <span>
                        {item.waktuMulai} - {item.waktuSelesai}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-300" />
                      <span className="text-sm font-medium">{item.namaPeminjam || item.peminjam}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 md:items-end">
                    <span className={`font-semibold text-xs ${getStatusColor(item.status)}`}>
                      Status: {getStatusLabel(item.status)}
                    </span>
                    <span className="text-gray-400 text-xs italic">{item.keterangan}</span>
                    {(item.status === "approved" || item.status === "diterima") && (
                      <button
                        onClick={() => handleSetSelesai(item._id)}
                        className="mt-2 px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Tandai Selesai
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}