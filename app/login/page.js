"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || "Login gagal.");
            } else {
                // Simpan token ke localStorage atau cookie jika perlu
                if (typeof window !== "undefined") {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", data.user.role);
                    localStorage.setItem("userLogin", JSON.stringify(data.user)); // <-- Tambahkan baris ini
                }
                // Redirect sesuai role
                if (data.user.role === "admin") {
                    router.push("/dashboard/admin");
                } else {
                    router.push("/dashboard/users");
                }
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
                        <LogIn size={36} className="text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-indigo-200 text-center drop-shadow mb-1">
                        Login
                    </h2>
                    {/* Label info akun admin */}
                    <div className="mb-4 text-center">
                        <span className="inline-block bg-indigo-900/60 text-indigo-300 px-3 py-1 rounded text-sm">
                            Akun admin: <b>username</b> <span className="text-white">admin</span> &nbsp;|&nbsp; <b>password</b> <span className="text-white">admin123</span>
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm text-center">
                        Masukkan username dan password Anda untuk masuk ke sistem.
                    </p>
                </div>
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="relative">
                        <label htmlFor="username" className="sr-only">Username</label>
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                        <input
                            id="username"
                            type="text"
                            placeholder="Masukkan Username Anda"
                            className="pl-11 pr-4 border border-gray-600 bg-gray-900 text-gray-100 placeholder-indigo-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold w-full transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                            autoComplete="username"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                        <input
                            id="password"
                            type="password"
                            placeholder="Masukkan Password Anda"
                            className="pl-11 pr-4 border border-gray-600 bg-gray-900 text-gray-100 placeholder-indigo-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold w-full transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {error && (
                        <div className="text-red-400 text-sm text-center">{error}</div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-gray-700 text-white font-bold shadow-lg hover:from-gray-700 hover:to-indigo-600 hover:scale-105 transition-all duration-200"
                    >
                        <LogIn size={20} />
                        {loading ? "Memproses..." : "Login"}
                    </button>
                </form>
                <div className="mt-8 text-center text-gray-400 text-sm">
                    Belum punya akun?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-indigo-300 hover:text-purple-400 transition"
                    >
                        Daftar di sini
                    </Link>
                </div>
            </div>
        </div>
    );
}