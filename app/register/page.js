"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, User, Lock } from "lucide-react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!username || !password || !confirm) {
            setError("Semua field wajib diisi.");
            return;
        }
        if (password.length < 6) {
            setError("Password minimal 6 karakter.");
            return;
        }
        if (password !== confirm) {
            setError("Konfirmasi password tidak sesuai.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || "Registrasi gagal.");
            } else {
                setSuccess("Registrasi berhasil! Silakan login.");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            }
        } catch (err) {
            setError("Terjadi kesalahan server.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
            <div className="bg-gray-800/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-700/20 rounded-full p-3 mb-2">
                        <UserPlus size={36} className="text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-indigo-200 text-center drop-shadow mb-1">
                        Register
                    </h2>
                    <p className="text-gray-400 text-sm text-center">
                        Daftarkan akun baru untuk menggunakan sistem booking ruangan.
                    </p>
                </div>
                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div className="relative">
                        <label htmlFor="username" className="sr-only">Username</label>
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                        <input
                            id="username"
                            type="text"
                            placeholder="Masukkan Username"
                            className="pl-11 pr-4 border border-gray-600 bg-gray-900 text-gray-100 placeholder-indigo-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold w-full transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                        <input
                            id="password"
                            type="password"
                            placeholder="Masukkan Password"
                            className="pl-11 pr-4 border border-gray-600 bg-gray-900 text-gray-100 placeholder-indigo-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold w-full transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="confirm" className="sr-only">Konfirmasi Password</label>
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                        <input
                            id="confirm"
                            type="password"
                            placeholder="Konfirmasi Password"
                            className="pl-11 pr-4 border border-gray-600 bg-gray-900 text-gray-100 placeholder-indigo-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold w-full transition"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    {error && (
                        <div className="text-red-400 text-sm text-center">{error}</div>
                    )}
                    {success && (
                        <div className="text-green-400 text-sm text-center">{success}</div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-gray-700 text-white font-bold shadow-lg hover:from-gray-700 hover:to-indigo-600 hover:scale-105 transition-all duration-200"
                    >
                        <UserPlus size={20} />
                        {loading ? "Mendaftarkan..." : "Register"}
                    </button>
                </form>
                <div className="mt-8 text-center text-gray-400 text-sm">
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-indigo-300 hover:text-purple-400 transition"
                    >
                        Login di sini
                    </Link>
                </div>
            </div>
        </div>
    );
}   