"use client";
import React from "react";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-gradient-to-tr from-indigo-700 via-purple-700 to-gray-700 p-1 shadow-lg mb-2">
            <div className="bg-gray-900 rounded-full p-4 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="7" width="18" height="13" rx="2" fill="#6366f1" opacity="0.15"/>
                <rect x="7" y="3" width="10" height="4" rx="2" fill="#6366f1"/>
                <rect x="3" y="7" width="18" height="13" rx="2" stroke="#6366f1" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-100 mb-2 text-center drop-shadow">
            Selamat Datang di Sistem Booking Ruangan
          </h1>
          <p className="text-lg text-gray-300 text-center max-w-xl">
            Mudahkan reservasi dan pengelolaan ruangan Anda secara online.<br />
            Silakan login untuk mulai menggunakan sistem.
          </p>
        </div>
        <div className="flex gap-6 mt-4">
          <Link href="/login">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-gray-700 text-white font-bold shadow-lg hover:from-gray-700 hover:to-indigo-600 hover:scale-105 transition-all duration-200">
              Login
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}