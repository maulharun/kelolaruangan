import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getDB } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  const { id } = params;
  const formData = await req.formData();
  const file = formData.get("foto");
  if (!file) return NextResponse.json({ msg: "File tidak ditemukan." }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", "foto");
  await fs.mkdir(uploadDir, { recursive: true });
  const filename = `${id}_${Date.now()}.jpg`;
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);

  // Simpan path foto ke database
  const fotoUrl = `/uploads/foto/${filename}`;
  const db = await getDB();
  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: { foto: fotoUrl } }
  );

  return NextResponse.json({ msg: "Foto berhasil diupload.", foto: fotoUrl });
}