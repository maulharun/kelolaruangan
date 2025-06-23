import { NextResponse } from "next/server";
import { getDB } from "@/app/lib/mongodb";

// GET semua ruangan
export async function GET() {
  const db = await getDB();
  const ruangan = await db.collection("ruangan").find({}).toArray();
  return NextResponse.json(ruangan);
}

// POST tambah ruangan
export async function POST(req) {
  const data = await req.json();
  if (!data.namaruangan) {
    return NextResponse.json({ msg: "Nama ruangan wajib diisi." }, { status: 400 });
  }
  const db = await getDB();
  await db.collection("ruangan").insertOne({
    namaruangan: data.namaruangan,
    lokasi: data.lokasi || "",
    kapasitas: data.kapasitas || "",
    keterangan: data.keterangan || "",
  });
  return NextResponse.json({ msg: "Ruangan berhasil ditambahkan." });
}