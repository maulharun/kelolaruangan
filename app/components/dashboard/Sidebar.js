"use client";

import Link from "next/link";
import {
     Home, Calendar, Users, LogOut, Bell, UserCircle, ClipboardList, Building2
} from "lucide-react";

const menuItems = {
    admin: [
        // Group 1: Dashboard
        [
            { icon: <Home className="w-5 h-5" />, title: "Dashboard", path: "/dashboard/admin" },
        ],
        // Group 2: Manajemen
        [
            { icon: <Calendar className="w-5 h-5" />, title: "Booking Ruangan", path: "/dashboard/admin/booking-validasi" },
            { icon: <Users className="w-5 h-5" />, title: "Kelola User", path: "/dashboard/admin/users" },
            { icon: <Building2 className="w-5 h-5" />, title: "Kelola Ruangan", path: "/dashboard/admin/ruangan" }
        ],
        // Group 3: Lainnya
        [
            { icon: <ClipboardList className="w-5 h-5" />, title: "Data Pemakaian Ruangan", path: "/dashboard/admin/pemakaian" },
        ]
    ],
    user: [
        // Group 1: Dashboard
        [
            { icon: <Home className="w-5 h-5" />, title: "Dashboard", path: "/dashboard/users" },
        ],
        // Group 2: Booking & Info
        [
            { icon: <Calendar className="w-5 h-5" />, title: "Booking Ruangan", path: "/dashboard/users/booking" },
            { icon: <Bell className="w-5 h-5" />, title: "Notifikasi", path: "/dashboard/users/notifikasi", badge: 0 },
            { icon: <ClipboardList className="w-5 h-5" />, title: "Data Pemakaian Ruangan", path: "/dashboard/users/pemakaian" },
        ],
        // Group 3: Lainnya
        [
            { icon: <UserCircle className="w-5 h-5" />, title: "Profil", path: "/dashboard/users/profil" },
        ]
    ]
};

export default function Sidebar({ open, onClose, role = "user", notificationCount = 0 }) {
    // Inject badge notifikasi jika ada
    if (role === "admin") {
        menuItems.admin[2][0].badge = notificationCount;
    }
    if (role === "user") {
        menuItems.user[1][1].badge = notificationCount;
    }

    return (
        <aside className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-gray-200 z-40 transform transition-transform duration-300 shadow-lg ${open ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-bold text-indigo-300 tracking-wide">Menu</span>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-indigo-400 transition text-2xl font-bold"
                        aria-label="Tutup Sidebar"
                    >
                        ×
                    </button>
                </div>
                <div className="space-y-6">
                    {menuItems[role]?.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <ul className="space-y-2.5">
                                {group.map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 group relative hover:bg-gray-700/60 rounded-lg p-2.5 transition-all duration-200">
                                        <div className="text-indigo-400">{item.icon}</div>
                                        <Link
                                            href={item.path}
                                            className="text-gray-200 hover:text-indigo-300 flex-1 transition-colors duration-200 font-medium tracking-wide text-sm"
                                        >
                                            {item.title}
                                        </Link>
                                        {item.badge > 0 && (
                                            <span className="absolute -right-1 -top-1 bg-indigo-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                                                {item.badge}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {groupIndex < menuItems[role].length - 1 && (
                                <div className="border-b border-indigo-200 my-5 opacity-20" />
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <Link
                        href="/logout"
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700/60 hover:text-red-400 transition"
                    >
                        <LogOut size={20} />
                        Logout
                    </Link>
                </div>
            </div>
        </aside>
    );
}