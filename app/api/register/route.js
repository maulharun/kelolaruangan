import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/app/lib/mongodb";

// Handler untuk POST /api/register
export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ msg: "Semua field wajib diisi." }, { status: 400 });
    }

    const db = await getDB();
    const existing = await db.collection("users").findOne({ username });

    if (existing) {
      return NextResponse.json({ msg: "Username sudah terdaftar." }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      username,
      password: hash,
      role: "user",
      namalengkap: null,
      fakultas: null,
      prodi: null,
      nim: null,
      tanggal_daftar: new Date(),
    });

    return NextResponse.json({ msg: "Registrasi berhasil." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: "Terjadi kesalahan server." }, { status: 500 });
  }
}