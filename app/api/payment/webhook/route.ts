import { NextRequest, NextResponse } from "next/server";
import { generateTicketToken } from "@/lib/ticketing/tickets";
import { sendWhatsAppMessage } from "@/lib/validations/fonnte";
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

function getWhatsAppMessage(
  participant: ParticipantContact,
  ticketToken: string,
  groupLink: string | null,
): string {
  const baseUrl = process.env.TICKET_PUBLIC_BASE_URL?.replace(/\/+$/, "");

  const ticketUrl = baseUrl
    ? `${baseUrl}/ticket/${encodeURIComponent(ticketToken)}`
    : null;

  const greeting = `Halo, Kak ${participant.name}! 👋😊`;

  const commonEnding = [
    "",
    "Terima kasih telah menjadi bagian dari Genotif 47! 💙",
    "",
    "Salam kreatif dan inovatif,",
    "Panitia Genotif 47 ✨",
  ];

  const ticketSection = ticketUrl
    ? ["🎟️ *Tiket peserta kamu:*", ticketUrl]
    : ["🎟️ Tiket digital kamu sedang dipersiapkan oleh panitia."];

  const groupSection = groupLink
    ? [
        "👇 *Yuk, bergabung ke grup peserta!*",
        groupLink,
        "",
        "Simpan tautan grup ini dan pantau informasi selanjutnya, ya! 📢",
      ]
    : ["📢 Informasi grup peserta akan diberikan oleh panitia."];

  const messages: Record<string, string[]> = {
    FUN_RUN: [
      greeting,
      "",
      "🎉 *YEAY! PENDAFTARAN FUN RUN TERKONFIRMASI!*",
      "",
      "Pembayaran kamu untuk FUN RUN Genotif 47 sudah berhasil dikonfirmasi. 🏃‍♂️🔥",
      "",
      "👟 Siapkan sepatu lari terbaikmu, jaga kondisi tubuh, dan bersiaplah untuk berlari bersama!",
      "",
      ...ticketSection,
      "",
      ...groupSection,
      "",
      "Sampai bertemu di garis start! 🏁💪",
      ...commonEnding,
    ],

    STMS: [
      greeting,
      "",
      "🌟 *PENDAFTARAN STMS / TALENT SHOW BERHASIL!*",
      "",
      "Pembayaran kamu sudah terkonfirmasi. Sekarang waktunya bersiap menunjukkan bakat terbaikmu di Genotif 47! 🎤🎭",
      "",
      "✨ Jangan lupa persiapkan penampilan dan perlengkapan yang dibutuhkan.",
      "",
      ...ticketSection,
      "",
      ...groupSection,
      "",
      "Berani tampil, berani bersinar! 🔥🌟",
      ...commonEnding,
    ],

    CERDAS_CERMAT: [
      greeting,
      "",
      "🧠 *PENDAFTARAN CERDAS CERMAT TERKONFIRMASI!*",
      "",
      "Pembayaran pendaftaran tim Cerdas Cermat Genotif 47 sudah berhasil dikonfirmasi. 🎉🏆",
      "",
      "📚 Ajak anggota tim mempersiapkan diri, mengasah pengetahuan, dan memperkuat kerja sama!",
      "",
      ...ticketSection,
      "",
      ...groupSection,
      "",
      "Semoga tim kalian siap memberikan kemampuan terbaik! 💪✨",
      ...commonEnding,
    ],

    MEWARNAI: [
      greeting,
      "",
      "🎨 *PENDAFTARAN LOMBA MEWARNAI BERHASIL!*",
      "",
      "Pembayaran pendaftaran telah berhasil dikonfirmasi. Terima kasih sudah bergabung dalam keseruan Genotif 47! 🌈🎉",
      "",
      "🖍️ Yuk, persiapkan ide dan kreativitas terbaikmu!",
      "",
      ...ticketSection,
      "",
      ...groupSection,
      "",
      "Selamat berkreasi dan bersenang-senang! 🎨✨",
      ...commonEnding,
    ],
  };

  const message = messages[participant.jenisLomba];

  if (!message) {
    return [
      greeting,
      "",
      "🎉 Pembayaran pendaftaran Genotif 47 kamu telah berhasil dikonfirmasi!",
      "",
      ...ticketSection,
      "",
      ...groupSection,
      ...commonEnding,
    ].join("\n");
  }

  return message.join("\n");
}

async function issueTicket(orderId: string): Promise<string | null> {
  // Ambil tiket yang sudah diterbitkan, jika ada.
  const existing = await db.orm.public.DataLomba.where({ orderId }).first();

  if (!existing || existing.statusBayar !== "PAID") {
    return null;
  }

  if (existing.ticketToken) {
    return existing.ticketToken;
  }

  // Token hanya diisi jika masih NULL.
  const token = generateTicketToken();

  const plan = db.sql.public.DataLomba.update({ ticketToken: token })
    .where((fields, fns) =>
      fns.and(
        fns.eq(fields.orderId, orderId),
        fns.eq(fields.statusBayar, "PAID"),
        fns.eq(fields.ticketToken, null),
      ),
    )
    .returning("ticketToken")
    .build();

  const rows = await db.runtime().query(plan);

  if (rows.length > 0 && rows[0].ticketToken) {
    return rows[0].ticketToken;
  }

  // Webhook lain mungkin sudah berhasil menerbitkan token.
  const latest = await db.orm.public.DataLomba.where({ orderId }).first();

  return latest?.statusBayar === "PAID" ? latest.ticketToken : null;
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
    let ticketToken: string | null = null;

    if (statusBayar === "PAID") {
      ticketToken = await issueTicket(order_id);

      if (!ticketToken) {
        console.error("TICKET_ISSUE_ERROR:", order_id);

        return NextResponse.json(
          {
            error: "Pembayaran terkonfirmasi, tetapi tiket gagal diterbitkan.",
          },
          { status: 500 },
        );
      }
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
        } else if (!ticketToken) {
          console.error("WhatsApp skipped: ticket token unavailable", order_id);
        } else {
          const groupLink = getGroupLink(participant.jenisLomba);

          const message = getWhatsAppMessage(
            participant,
            ticketToken,
            groupLink,
          );

          await sendWhatsAppMessage(participant.target, message);

          console.log("FONNTE_SEND_SUCCESS", {
            order_id,
            jenisLomba: participant.jenisLomba,
          });
        }
      } catch (error) {
        console.error("FONNTE_SEND_ERROR:", {
          order_id,
          error,
        });
      }
    }

    return NextResponse.json({
      received: true,
      updated: true,
    });
  } catch (error) {
    console.error("Midtrans webhook error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
