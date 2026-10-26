import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");

  if (!orderId || !orderId.trim()) {
    return NextResponse.json(
      { error: "Order ID wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const lomba = await db.orm.public.DataLomba.where({ orderId }).first();

    if (!lomba) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: {
        registrationId: lomba.id,
        statusBayar: lomba.statusBayar,
      },
    });
  } catch (error) {
    console.error("PAYMENT_STATUS_ERROR:", error);

    return NextResponse.json(
      { error: "Gagal memeriksa status pembayaran." },
      { status: 500 },
    );
  }
}
