import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

type MidtransNotification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
};

function mapPaymentStatus(
  transactionStatus: string,
  fraudStatus?: string,
): string | null {
  switch (transactionStatus) {
    case "capture":
      if (fraudStatus === "accept") return "PAID";
      if (fraudStatus === "challenge") return "PENDING";
      return null;

    case "settlement":
      return "PAID";

    case "pending":
      return "PENDING";

    case "deny":
    case "cancel":
    case "expire":
      return "FAILED";

    case "refund":
    case "partial_refund":
      return "REFUNDED";

    default:
      // Jangan mengubah status untuk status yang tidak dikenali.
      return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const notification = (await request.json()) as MidtransNotification;

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = notification;

    if (
      !order_id ||
      !status_code ||
      !gross_amount ||
      !signature_key ||
      !transaction_status
    ) {
      return NextResponse.json(
        { error: "Invalid notification payload" },
        { status: 400 },
      );
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      console.error("MIDTRANS_SERVER_KEY is not configured");

      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Signature Midtrans = SHA512(order_id + status_code
    // + gross_amount + ServerKey)
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest("hex");

    const received = Buffer.from(signature_key, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const statusBayar = mapPaymentStatus(transaction_status, fraud_status);

    // Status yang belum kita dukung tidak mengubah database.
    if (!statusBayar) {
      return NextResponse.json({
        received: true,
        updated: false,
        reason: "Unsupported transaction status",
      });
    }

    // SQL builder Prisma 8: cari order berdasarkan orderId,
    // lalu ubah status pembayaran.
    const updatePlan = db.sql.public.DataLomba.update({ statusBayar })
      .where((fields, fns) => fns.eq(fields.orderId, order_id))
      .returning("id", "orderId", "statusBayar")
      .build();

    const updatedRows = await db.runtime().query(updatePlan);

    if (!updatedRows.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      received: true,
      updated: true,
      orderId: order_id,
      statusBayar,
    });
  } catch (error) {
    console.error("Midtrans webhook error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
