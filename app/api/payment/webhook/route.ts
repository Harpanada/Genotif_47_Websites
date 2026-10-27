import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/fonnte";
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

type ParticipantContact = {
  registrationId: string;
  jenisLomba: string;
  target: string;
  name: string;
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
//Fonte Auto Message
async function getParticipantContact(
  orderId: string,
): Promise<ParticipantContact | null> {
  const lomba = await db.orm.public.DataLomba.where({ orderId }).first();

  if (!lomba) return null;

  switch (lomba.jenisLomba) {
    case "FUN_RUN": {
      const detail = await db.orm.public.DetailFunRun.where({
        dataLombaId: lomba.id,
      }).first();

      if (!detail) return null;

      return {
        registrationId: lomba.id,
        jenisLomba: lomba.jenisLomba,
        target: detail.noWhatsapp,
        name: detail.namaLengkap,
      };
    }

    case "STMS": {
      const detail = await db.orm.public.DetailSTMS.where({
        dataLombaId: lomba.id,
      }).first();

      if (!detail) return null;

      return {
        registrationId: lomba.id,
        jenisLomba: lomba.jenisLomba,
        target: detail.noWhatsapp,
        name: detail.namaPerwakilan,
      };
    }

    case "CERDAS_CERMAT": {
      const detail = await db.orm.public.DetailCerdasCermat.where({
        dataLombaId: lomba.id,
      }).first();

      if (!detail) return null;

      return {
        registrationId: lomba.id,
        jenisLomba: lomba.jenisLomba,
        target: detail.whatsappPendamping,
        name: detail.namaGuruPendamping,
      };
    }

    case "MEWARNAI": {
      const detail = await db.orm.public.DetailMewarnai.where({
        dataLombaId: lomba.id,
      }).first();

      if (!detail) return null;

      return {
        registrationId: lomba.id,
        jenisLomba: lomba.jenisLomba,
        target: detail.whatsappOrangTua,
        name: detail.namaOrangTua,
      };
    }

    default:
      return null;
  }
}

function getGroupLink(jenisLomba: string): string | null {
  const links: Record<string, string | undefined> = {
    FUN_RUN: process.env.FONNTE_GROUP_FUN_RUN,
    STMS: process.env.FONNTE_GROUP_STMS,
    CERDAS_CERMAT: process.env.FONNTE_GROUP_CERDAS_CERMAT,
    MEWARNAI: process.env.FONNTE_GROUP_MEWARNAI,
  };

  return links[jenisLomba]?.trim() || null;
}

//Main Function
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
    const existing = await db.orm.public.DataLomba.where({
      orderId: order_id,
    }).first();

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const wasAlreadyPaid = existing.statusBayar === "PAID";

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

    console.log("FONNTE DEBUG", {
      order_id,
      statusBayar,
      previousStatus: existing.statusBayar,
      wasAlreadyPaid,
    });

    if (statusBayar === "PAID" && !wasAlreadyPaid) {
      try {
        const participant = await getParticipantContact(order_id);

        if (!participant) {
          console.error(
            "WhatsApp skipped: participant details not found",
            order_id,
          );
        } else {
          const groupLink = getGroupLink(participant.jenisLomba);

          const message = [
            `Halo ${participant.name}!`,
            "",
            "Pembayaran pendaftaran Genotif telah berhasil dikonfirmasi.",
            `ID Pendaftaran: ${participant.registrationId}`,
            `Jenis Lomba: ${participant.jenisLomba}`,
            "",
            groupLink
              ? `Silakan bergabung ke grup lomba melalui tautan berikut:\n${groupLink}`
              : "Informasi grup lomba akan diberikan oleh panitia.",
            "",
            "Terima kasih telah mendaftar di Genotif!",
          ].join("\n");

          await sendWhatsAppMessage(participant.target, message);
        }
      } catch (error) {
        // Jangan membuat pembayaran gagal hanya karena WhatsApp gagal.
        console.error("FONNTE_SEND_ERROR:", error);
      }
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
