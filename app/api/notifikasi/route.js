import { getDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json([], { status: 200 });
  }

  const db = await getDB();
  const notifikasi = await db
    .collection("notifikasi")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  // Ubah _id ke string agar bisa dipakai di frontend
  notifikasi.forEach((n) => (n._id = n._id.toString()));

  return NextResponse.json(notifikasi);
}