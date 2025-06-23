"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, XCircle } from "lucide-react";
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

export default function NotifikasiUserPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    // Fetch notifikasi dari API
    fetch(`/api/notifikasi?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => {
        setNotifications([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
      <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="user" />
      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarOpen ? "pl-64" : "pl-0"
        }`}
      >
        <div className="max-w-2xl mx-auto bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-700 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-7 h-7 text-indigo-400" />
            <h2 className="text-2xl font-bold text-indigo-200 tracking-wide">
              Notifikasi Pengajuan Ruangan
            </h2>
          </div>
          {loading ? (
            <div className="text-gray-400 text-center py-8">
              Memuat notifikasi...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              Tidak ada notifikasi saat ini.
            </div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${
                    notif.pesan?.toLowerCase().includes("diterima") || notif.pesan?.toLowerCase().includes("disetujui")
                      ? "border-green-500 bg-green-900/10"
                      : notif.pesan?.toLowerCase().includes("ditolak")
                      ? "border-red-500 bg-red-900/10"
                      : "border-blue-500 bg-blue-900/10"
                  }`}
                >
                  {notif.pesan?.toLowerCase().includes("diterima") || notif.pesan?.toLowerCase().includes("disetujui") ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1" />
                  ) : notif.pesan?.toLowerCase().includes("ditolak") ? (
                    <XCircle className="w-6 h-6 text-red-400 mt-1" />
                  ) : (
                    <Bell className="w-6 h-6 text-blue-400 mt-1" />
                  )}
                  <div>
                    <div className="text-gray-100 font-medium">{notif.pesan}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                    </div>
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