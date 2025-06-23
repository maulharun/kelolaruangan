"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700/90 backdrop-blur-lg shadow-lg border-b border-gray-700/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="13" rx="2" fill="#23272e" opacity="0.9"/>
              <rect x="7" y="3" width="10" height="4" rx="2" fill="#6366f1"/>
            </svg>
            <span className="text-gray-100 font-extrabold text-2xl tracking-tight group-hover:text-indigo-400 transition">
              BookingRuang
            </span>
          </span>
        </Link>
        <div className="flex gap-2 items-center">
          <Link
            href="/"
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-200 font-medium hover:bg-gray-700/60 hover:text-indigo-300 transition"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M3 12L12 3l9 9" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 21V12h6v9" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Home
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-white font-semibold shadow hover:from-purple-600 hover:to-indigo-500 transition"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 17l5-5-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 12H3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}