"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import Navbar from "@/app/components/dashboard/Navbar";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function AdminRuanganPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [ruangan, setRuangan] = useState([]);
    const [form, setForm] = useState({ namaruangan: "", lokasi: "", kapasitas: "", keterangan: "" });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ namaruangan: "", lokasi: "", kapasitas: "", keterangan: "" });
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    // Fetch data ruangan
    const fetchRuangan = async () => {
        try {
            const res = await fetch("/api/ruangan");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setRuangan(data);
        } catch {
            setRuangan([]);
            setError("Gagal mengambil data ruangan.");
        }
    };

    useEffect(() => {
        fetchRuangan();
    }, []);

    // Handle tambah ruangan
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMsg("");
        if (!form.namaruangan) {
            setError("Nama ruangan wajib diisi.");
            return;
        }
        const res = await fetch("/api/ruangan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        let data = {};
        try {
            data = await res.json();
        } catch {
            data = { msg: "Gagal parsing response dari server." };
        }

        if (res.ok) {
            setMsg(data.msg || "Ruangan berhasil ditambahkan.");
            setForm({ namaruangan: "", lokasi: "", kapasitas: "", keterangan: "" });
            fetchRuangan();
        } else {
            setError(data.msg || "Gagal menambah ruangan.");
        }
    };

    // Handle hapus ruangan
    const handleDelete = async (id) => {
        if (!confirm("Hapus ruangan ini?")) return;
        const res = await fetch(`/api/ruangan/${id}`, { method: "DELETE" });
        let data = {};
        try {
            data = await res.json();
        } catch {
            data = { msg: "Gagal parsing response dari server." };
        }
        if (res.ok) {
            setMsg(data.msg);
            fetchRuangan();
        } else {
            setError(data.msg || "Gagal menghapus ruangan.");
        }
    };

    // Handle edit ruangan
    const handleEdit = (r) => {
        setEditId(r._id);
        setEditForm({
            namaruangan: r.namaruangan,
            lokasi: r.lokasi,
            kapasitas: r.kapasitas,
            keterangan: r.keterangan,
        });
        setMsg(""); setError("");
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMsg("");
        if (!editForm.namaruangan) {
            setError("Nama ruangan wajib diisi.");
            return;
        }
        const res = await fetch(`/api/ruangan/${editId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        });
        let data = {};
        try {
            data = await res.json();
        } catch {
            data = { msg: "Gagal parsing response dari server." };
        }
        if (res.ok) {
            setMsg(data.msg);
            setEditId(null);
            fetchRuangan();
        } else {
            setError(data.msg || "Gagal mengupdate ruangan.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800">
            <Navbar toggleSidebar={() => setSidebarOpen((v) => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role="admin" />
            <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? "pl-64" : "pl-0"}`}>
                <div className="max-w-4xl mx-auto bg-gray-900/90 rounded-2xl shadow-2xl p-10 border border-gray-800 mt-12">
                    <h2 className="text-2xl font-bold text-indigo-200 mb-8 flex items-center gap-3">
                        <Plus className="w-7 h-7 text-indigo-400" /> Kelola Data Ruangan
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-wrap gap-5 mb-8">
                        <input
                            type="text"
                            placeholder="Nama Ruangan"
                            className="flex-1 min-w-[200px] rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            value={form.namaruangan}
                            onChange={e => setForm(f => ({ ...f, namaruangan: e.target.value }))}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Lokasi"
                            className="flex-1 min-w-[140px] rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            value={form.lokasi}
                            onChange={e => setForm(f => ({ ...f, lokasi: e.target.value }))}
                        />
                        <input
                            type="number"
                            placeholder="Kapasitas"
                            className="flex-1 min-w-[120px] rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            value={form.kapasitas}
                            onChange={e => setForm(f => ({ ...f, kapasitas: e.target.value }))}
                        />
                        <input
                            type="text"
                            placeholder="Keterangan"
                            className="flex-1 min-w-[140px] rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-gray-100 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            value={form.keterangan}
                            onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))}
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition text-base shadow"
                        >
                            Tambah
                        </button>
                    </form>
                    {msg && <div className="text-green-400 text-base mb-4">{msg}</div>}
                    {error && <div className="text-red-400 text-base mb-4">{error}</div>}
                    <div className="overflow-x-auto rounded-xl border border-gray-800">
                        <table className="min-w-full text-gray-200 text-lg">
                            <thead>
                                <tr className="bg-gray-800 border-b border-gray-700">
                                    <th className="py-4 px-4 font-bold text-left">Nama Ruangan</th>
                                    <th className="py-4 px-4 font-bold text-left">Lokasi</th>
                                    <th className="py-4 px-4 font-bold text-left">Kapasitas</th>
                                    <th className="py-4 px-4 font-bold text-left">Keterangan</th>
                                    <th className="py-4 px-4 font-bold text-center w-40">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ruangan.map((r, idx) => (
                                    <tr
                                        key={r._id}
                                        className={
                                            (idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800") +
                                            " border-b border-gray-700 hover:bg-gray-700/60 transition"
                                        }
                                    >
                                        {editId === r._id ? (
                                            <>
                                                <td className="py-3 px-4 align-middle">
                                                    <input
                                                        type="text"
                                                        className="rounded-md bg-gray-800 border border-gray-600 px-3 py-2 text-gray-100 w-full text-base"
                                                        value={editForm.namaruangan}
                                                        onChange={e => setEditForm(f => ({ ...f, namaruangan: e.target.value }))}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 align-middle">
                                                    <input
                                                        type="text"
                                                        className="rounded-md bg-gray-800 border border-gray-600 px-3 py-2 text-gray-100 w-full text-base"
                                                        value={editForm.lokasi}
                                                        onChange={e => setEditForm(f => ({ ...f, lokasi: e.target.value }))}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 align-middle">
                                                    <input
                                                        type="number"
                                                        className="rounded-md bg-gray-800 border border-gray-600 px-3 py-2 text-gray-100 w-full text-base"
                                                        value={editForm.kapasitas}
                                                        onChange={e => setEditForm(f => ({ ...f, kapasitas: e.target.value }))}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 align-middle">
                                                    <input
                                                        type="text"
                                                        className="rounded-md bg-gray-800 border border-gray-600 px-3 py-2 text-gray-100 w-full text-base"
                                                        value={editForm.keterangan}
                                                        onChange={e => setEditForm(f => ({ ...f, keterangan: e.target.value }))}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 flex gap-2 justify-center align-middle">
                                                    <button
                                                        onClick={handleEditSubmit}
                                                        className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                                                        title="Simpan"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditId(null)}
                                                        className="px-3 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 transition"
                                                        title="Batal"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-3 px-4 align-middle">{r.namaruangan}</td>
                                                <td className="py-3 px-4 align-middle">{r.lokasi}</td>
                                                <td className="py-3 px-4 align-middle">{r.kapasitas}</td>
                                                <td className="py-3 px-4 align-middle">{r.keterangan}</td>
                                                <td className="py-3 px-4 flex gap-2 justify-center align-middle">
                                                    <button
                                                        onClick={() => handleEdit(r)}
                                                        className="px-3 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(r._id)}
                                                        className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {ruangan.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-400 text-lg">
                                            Belum ada data ruangan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}