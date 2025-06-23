import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/app/lib/mongodb";

// GET: Ambil semua user
export async function GET() {
  try {
    const db = await getDB();
    const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ msg: "Gagal mengambil data users." }, { status: 500 });
  }
}

// POST: Tambah user baru
export async function POST(req) {
  try {
    const data = await req.json();
    // Validasi sederhana
    if (!data.username || !data.password) {
      return NextResponse.json({ msg: "Username dan password wajib diisi." }, { status: 400 });
    }
    const db = await getDB();
    const existing = await db.collection("users").findOne({ username: data.username });
    if (existing) {
      return NextResponse.json({ msg: "Username sudah terdaftar." }, { status: 400 });
    }
    await db.collection("users").insertOne({
      username: data.username,
      password: data.password, // hash di endpoint register/login
      role: data.role || "user",
      fakultas: data.fakultas || null,
      prodi: data.prodi || null,
      nim: data.nim || null,
      tanggal_daftar: new Date(),
      namalengkap: data.namalengkap || null,
    });
    return NextResponse.json({ msg: "User berhasil ditambahkan." });
  } catch (err) {
    return NextResponse.json({ msg: "Gagal menambah user." }, { status: 500 });
  }
}

// DELETE: Hapus user berdasarkan id
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ msg: "ID user wajib diisi." }, { status: 400 });
    }
    const db = await getDB();
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ msg: "User berhasil dihapus." });
  } catch (err) {
    return NextResponse.json({ msg: "Gagal menghapus user." }, { status: 500 });
  }
}

// PATCH: Update user (edit data user)
export async function PATCH(req) {
  try {
    const { id, ...update } = await req.json();
    if (!id) {
      return NextResponse.json({ msg: "ID user wajib diisi." }, { status: 400 });
    }
    const db = await getDB();
    // Jangan update _id dan password langsung di sini
    delete update._id;
    if (update.password) delete update.password;
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    return NextResponse.json({ msg: "User berhasil diupdate." });
  } catch (err) {
    return NextResponse.json({ msg: "Gagal mengupdate user." }, { status: 500 });
  }
}