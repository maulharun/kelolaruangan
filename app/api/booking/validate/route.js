import { getDB } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req) {
    const { id, status, alasanTolak } = await req.json();
    const db = await getDB();

    // Ambil data booking
    const booking = await db.collection("booking").findOne({ _id: new ObjectId(id) });
    if (!booking) return Response.json({ error: "Booking tidak ditemukan" }, { status: 404 });

    // Update status booking
    await db.collection("booking").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, alasanTolak: alasanTolak || "" } }
    );

    // Buat notifikasi baru sesuai status
    let pesan = "";
    if (status === "approved") {
        pesan = `Booking ruangan ${booking.room} pada ${booking.tanggal} telah disetujui.`;
    } else if (status === "rejected") {
        pesan = `Booking ruangan ${booking.room} pada ${booking.tanggal} ditolak. Alasan: ${alasanTolak}`;
    } else if (status === "selesai") {
        pesan = `Peminjaman ruangan ${booking.room} pada ${booking.tanggal} telah selesai.`;
    }

    // Hanya insert notifikasi jika ada pesan
    if (pesan) {
        await db.collection("notifikasi").insertOne({
            userId: booking.userId,
            bookingId: booking._id,
            pesan,
            status: "unread",
            createdAt: new Date(),
        });
    }

    return Response.json({ success: true });
}