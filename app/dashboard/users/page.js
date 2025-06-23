"use client";

import { useState } from "react";
import Navbar from "@/app/components/dashboard/Navbar";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function UserDashboard() {
  // Sidebar default terbuka
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
      <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="user" />
      <main
        className={`pt-20 transition-all duration-300 ${
          sidebarOpen ? "pl-64" : "pl-0"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-indigo-200 mb-4">Dashboard User</h1>
          <p className="text-gray-300">
            Selamat datang di dashboard user. Silakan lakukan booking ruangan atau cek profil Anda melalui menu di samping.
          </p>
        </div>
      </main>
    </div>
  );
}