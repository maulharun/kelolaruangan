import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/app/lib/mongodb";

// GET profil user
export async function GET(req, context) {
  const { id } = await context.params;
  const db = await getDB();
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );
  if (!user) return NextResponse.json({ msg: "User tidak ditemukan." }, { status: 404 });
  return NextResponse.json(user);
}

// PATCH update profil user
export async function PATCH(req, context) {
  const { id } = await context.params;
  const data = await req.json();
  const db = await getDB();
  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: {
      namalengkap: data.namalengkap || null,
      fakultas: data.fakultas || null,
      prodi: data.prodi || null,
      nim: data.nim || null,
    }}
  );
  return NextResponse.json({ msg: "Profil berhasil diupdate." });
}