import { NextResponse } from "next/server";
import { getDB } from "@/app/lib/mongodb"; // Pastikan path ini sesuai dengan project kamu

export async function GET() {
  try {
    const db = await getDB();
    const bookings = await db.collection("booking").find({}).sort({ createdAt: -1 }).toArray();
    // Ubah _id ke string agar bisa dipakai di frontend
    const result = bookings.map(b => ({
      ...b,
      _id: b._id.toString(),
    }));
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Validasi field wajib
    const required = ["room", "tanggal", "waktuMulai", "waktuSelesai", "userId", "namaPeminjam", "nim", "prodi"];
    for (const key of required) {
      if (!body[key]) {
        return NextResponse.json({ msg: `Field ${key} wajib diisi.` }, { status: 400 });
      }
    }

    const db = await getDB();
    const result = await db.collection("booking").insertOne({
      room: body.room,
      tanggal: body.tanggal,
      waktuMulai: body.waktuMulai,
      waktuSelesai: body.waktuSelesai,
      keterangan: body.keterangan || "",
      userId: body.userId,
      namaPeminjam: body.namaPeminjam,
      nim: body.nim,
      prodi: body.prodi,
      createdAt: new Date(),
      status: "pending", // default status
    });

    return NextResponse.json({ msg: "Booking berhasil diajukan.", bookingId: result.insertedId });
  } catch (err) {
    return NextResponse.json({ msg: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}