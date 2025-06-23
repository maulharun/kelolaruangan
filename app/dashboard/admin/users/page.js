"use client";

import { useState, useEffect } from "react";
import { Bell, User, Search, Trash2, Pencil, Plus, Lock } from "lucide-react";
import Navbar from "@/app/components/dashboard/Navbar";
import Sidebar from "@/app/components/dashboard/Sidebar";
import bcrypt from "bcryptjs";

export default function NotifikasiAdminPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // Modal states
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ username: "", namalengkap: "", role: "user", password: "" });
    const [editId, setEditId] = useState(null);
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch {
            setUsers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (u) =>
            (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
            (u.namalengkap || "").toLowerCase().includes(search.toLowerCase()) ||
            (u.role || "").toLowerCase().includes(search.toLowerCase())
    );

    // Hapus user
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus user ini?")) return;
        try {
            const res = await fetch("/api/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u._id !== id));
            } else {
                alert(data.msg || "Gagal menghapus user.");
            }
        } catch {
            alert("Gagal menghapus user.");
        }
    };

    // Buka modal edit
    const handleEdit = (user) => {
        setForm({
            username: user.username || "",
            namalengkap: user.namalengkap || "",
            role: user.role || "user",
            password: "",
        });
        setEditId(user._id);
        setFormError("");
        setShowEdit(true);
    };

    // Buka modal tambah
    const handleAdd = () => {
        setForm({ username: "", namalengkap: "", role: "user", password: "" });
        setEditId(null);
        setFormError("");
        setShowAdd(true);
    };

    // Handle input form
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Submit edit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError("");
        if (!form.username || !form.role) {
            setFormError("Username dan role wajib diisi.");
            setFormLoading(false);
            return;
        }
        try {
            const res = await fetch("/api/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editId,
                    username: form.username,
                    namalengkap: form.namalengkap,
                    role: form.role,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u._id === editId
                            ? { ...u, username: form.username, namalengkap: form.namalengkap, role: form.role }
                            : u
                    )
                );
                setShowEdit(false);
            } else {
                setFormError(data.msg || "Gagal update user.");
            }
        } catch {
            setFormError("Gagal update user.");
        }
        setFormLoading(false);
    };

    // Submit tambah
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError("");
        if (!form.username || !form.role || !form.password) {
            setFormError("Username, password, dan role wajib diisi.");
            setFormLoading(false);
            return;
        }
        try {
            // Hash password sebelum dikirim ke backend
            const hashedPassword = await bcrypt.hash(form.password, 10);
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    namalengkap: form.namalengkap,
                    role: form.role,
                    password: hashedPassword,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                fetchUsers();
                setShowAdd(false);
            } else {
                setFormError(data.msg || "Gagal tambah user.");
            }
        } catch {
            setFormError("Gagal tambah user.");
        }
        setFormLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
            <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="admin" />
            <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}>
                <div className="max-w-5xl mx-auto bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-700 mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="w-7 h-7 text-indigo-400" />
                        <h2 className="text-2xl font-bold text-indigo-200 tracking-wide">
                            Kelola Seluruh Users
                        </h2>
                        <button
                            onClick={handleAdd}
                            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition"
                        >
                            <Plus className="w-5 h-5" /> Tambah User
                        </button>
                    </div>
                    <div className="mb-6 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari username, nama lengkap, atau role..."
                            className="w-full rounded-lg bg-gray-900 border border-gray-600 text-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {loading ? (
                        <div className="text-gray-400 text-center py-8">Memuat data...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-200">
                                <thead>
                                    <tr className="bg-gray-900/80">
                                        <th className="py-2 px-4 text-left">Username</th>
                                        <th className="py-2 px-4 text-left">Nama Lengkap</th>
                                        <th className="py-2 px-4 text-left">Role</th>
                                        <th className="py-2 px-4 text-left">Tanggal Daftar</th>
                                        <th className="py-2 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-gray-400">
                                                Tidak ada user ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-900/60">
                                                <td className="py-2 px-4">{user.username}</td>
                                                <td className="py-2 px-4">{user.namalengkap || "-"}</td>
                                                <td className="py-2 px-4 capitalize">{user.role}</td>
                                                <td className="py-2 px-4">
                                                    {user.tanggal_daftar ? new Date(user.tanggal_daftar).toLocaleString() : "-"}
                                                </td>
                                                <td className="py-2 px-4 flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-semibold shadow transition"
                                                    >
                                                        <Pencil className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* Modal Edit */}
                {showEdit && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <form
                            onSubmit={handleEditSubmit}
                            className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-lg"
                        >
                            <h3 className="text-lg font-bold text-indigo-300 mb-4">Edit User</h3>
                            <div className="mb-3">
                                <label className="block text-gray-300 text-sm mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleFormChange}
                                    className="w-full rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-300 text-sm mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="namalengkap"
                                    value={form.namalengkap}
                                    onChange={handleFormChange}
                                    className="w-full rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-300 text-sm mb-1">Role</label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleFormChange}
                                    className="w-full rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                    required
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            {formError && (
                                <div className="text-red-400 text-sm text-center mb-2">{formError}</div>
                            )}
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEdit(false)}
                                    className="px-4 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                                    disabled={formLoading}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                                    disabled={formLoading}
                                >
                                    {formLoading ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                {/* Modal Tambah */}
                {showAdd && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <form
                            onSubmit={handleAddSubmit}
                            className="bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-700 shadow-lg"
                        >
                            <h3 className="text-lg font-bold text-indigo-300 mb-4">Tambah User</h3>
                            <div className="mb-3">
                                <label className="block text-gray-300 text-sm mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleFormChange}
                                    className="w-full rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-300 text-sm mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="namalengkap"
                                    value={form.namalengkap}
                                    onChange={handleFormChange}
                                    className="w-full rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-300 text-sm mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleFormChange}
                                        className="pl-11 pr-4 border border-gray-600 bg-gray-900 text-gray-100 placeholder-indigo-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold w-full transition"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-300 text-sm mb-1">Role</label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleFormChange}
                                    className="w-full rounded bg-gray-900 border border-gray-600 px-3 py-2 text-gray-100"
                                    required
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            {formError && (
                                <div className="text-red-400 text-sm text-center mb-2">{formError}</div>
                            )}
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAdd(false)}
                                    className="px-4 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                                    disabled={formLoading}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                                    disabled={formLoading}
                                >
                                    {formLoading ? "Menyimpan..." : "Tambah"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}