import { useState, useEffect, useRef } from 'react';
import { Menu, User } from 'lucide-react';
import Link from 'next/link';

// Fungsi decode JWT (tanpa library eksternal)
function parseJwt(token) {
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export default function Navbar({ toggleSidebar }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        let roleLabel = 'User';
        if (token) {
            const payload = parseJwt(token);
            if (payload?.role === 'manager') roleLabel = 'Manager';
            else if (payload?.role === 'admin') roleLabel = 'Admin';
            else if (payload?.role) roleLabel = payload.role.charAt(0).toUpperCase() + payload.role.slice(1);
        }
        setRole(roleLabel);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow w-full h-16 flex items-center justify-between px-4 fixed top-0 z-30">
            <button onClick={toggleSidebar} className="text-indigo-400 text-2xl hover:text-indigo-300 transition">
                <Menu />
            </button>
            <h1 className="text-lg font-semibold text-indigo-200 hidden md:block tracking-wide">Dashboard</h1>
            <div className="relative" ref={dropdownRef}>
                <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <span className="text-sm text-gray-200 hidden sm:block">{role}</span>
                    <User className="w-8 h-8 text-indigo-400" />
                </div>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-md z-50">
                        <Link
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                        >
                            Profil
                        </Link>
                        <button
                            onClick={() => {
                                document.cookie = 'user=; Max-Age=0; path=/;';
                                localStorage.removeItem('user');
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}