import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_jwt_anda";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ msg: "Semua field wajib diisi." }, { status: 400 });
    }

    const db = await getDB();
    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return NextResponse.json({ msg: "Username tidak ditemukan." }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ msg: "Password salah." }, { status: 400 });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Kirim data user yang login (tanpa password) dan set cookie token
    const res = NextResponse.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        namalengkap: user.namalengkap || null,
        fakultas: user.fakultas || null,
        prodi: user.prodi || null,
        nim: user.nim || null,
        tanggal_daftar: user.tanggal_daftar || null,
        foto: user.foto || null,
      },
    });

    // Set cookie token agar bisa dibaca middleware
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ msg: "Terjadi kesalahan server." }, { status: 500 });
  }
}