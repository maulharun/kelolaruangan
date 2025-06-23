import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/app/lib/mongodb";

// GET detail ruangan
export async function GET(req, context) {
  const { id } = await context.params;
  const db = await getDB();
  const ruangan = await db.collection("ruangan").findOne({ _id: new ObjectId(id) });
  if (!ruangan) return NextResponse.json({ msg: "Ruangan tidak ditemukan." }, { status: 404 });
  return NextResponse.json(ruangan);
}

// PATCH edit ruangan
export async function PATCH(req, context) {
  const { id } = await context.params;
  const data = await req.json();
  const db = await getDB();
  await db.collection("ruangan").updateOne(
    { _id: new ObjectId(id) },
    { $set: {
      namaruangan: data.namaruangan,
      lokasi: data.lokasi,
      kapasitas: data.kapasitas,
      keterangan: data.keterangan,
    }}
  );
  return NextResponse.json({ msg: "Ruangan berhasil diupdate." });
}

// DELETE hapus ruangan
export async function DELETE(req, context) {
  const { id } = await context.params;
  const db = await getDB();
  await db.collection("ruangan").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ msg: "Ruangan berhasil dihapus." });
}