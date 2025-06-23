"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Building2, Clock } from "lucide-react";
import Navbar from "@/app/components/dashboard/Navbar";
import Sidebar from "@/app/components/dashboard/Sidebar";

// Fungsi decode JWT (tanpa library eksternal)
function parseJwt(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function getUserId() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = parseJwt(token);
    return payload?.id || null;
  }
  return null;
}

function getToday() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

function getNextMonth() {
  const today = new Date();
  today.setMonth(today.getMonth() + 1);
  return today.toISOString().slice(0, 10);
}

export default function PemakaianRuanganUserPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pemakaian, setPemakaian] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setPemakaian([]);
      setLoading(false);
      return;
    }
    const today = getToday();
    const nextMonth = getNextMonth();
    // Ambil data booking milik user, status approved, 1 bulan ke depan
    fetch(`/api/booking?userId=${userId}&status=approved&start=${today}&end=${nextMonth}`)
      .then(res => res.json())
      .then(data => {
        setPemakaian(data);
        setLoading(false);
      })
      .catch(() => {
        setPemakaian([]);
        setLoading(false);
      });
  }, []);

  // Fungsi label status
  function getStatusLabel(status) {
    if (status === "approved" || status === "diterima") return "Diterima";
    if (status === "rejected" || status === "ditolak") return "Ditolak";
    if (status === "selesai") return "Selesai";
    return "Pending";
  }

  // Fungsi warna status
  function getStatusColor(status) {
    if (status === "approved" || status === "diterima") return "text-green-400";
    if (status === "rejected" || status === "ditolak") return "text-red-400";
    if (status === "selesai") return "text-blue-400";
    return "text-yellow-300";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
      <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="user" />
      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarOpen ? "pl-64" : "pl-0"
        }`}
      >
        <div className="max-w-3xl mx-auto bg-gray-800/90 rounded-2xl shadow-xl p-6 md:p-10 border border-gray-700 mt-8">
          <div className="flex items-center gap-3 mb-8">
            <CalendarDays className="w-7 h-7 text-indigo-400" />
            <h2 className="text-2xl font-bold text-indigo-200 tracking-wide">
              Data Pemakaian Ruangan (1 Bulan Kedepan)
            </h2>
          </div>
          {loading ? (
            <div className="text-gray-400 text-center py-8">
              Memuat data...
            </div>
          ) : pemakaian.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              Tidak ada data pemakaian ruangan dalam sebulan ke depan.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pemakaian.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-900/80 border border-indigo-700/30 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center gap-4 shadow"
                >
                  <div className="flex items-center gap-2 min-w-[140px]">
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
                      <span className="text-xs text-gray-400">Peminjam:</span>
                      <span className="text-sm font-medium">{item.namaPeminjam || item.peminjam}</span>
                    </div>
                  </div>
                  <div className={`font-semibold text-xs ${getStatusColor(item.status)} md:text-right`}>
                    Status: {getStatusLabel(item.status)}
                    {item.keterangan && (
                      <div className="text-gray-400 text-xs italic mt-1">{item.keterangan}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}