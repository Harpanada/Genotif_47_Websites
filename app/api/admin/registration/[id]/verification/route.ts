import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin/auth";
import { db } from "@/src/prisma/db";
import { createSnapTransaction } from "@/lib/validations/midtrans";
import { sendWhatsAppMessage } from "@/lib/validations/fonnte";
import { HARGA_FUN_RUN_INTERNAL } from "@/lib/pra-event/price";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

function errorResponse(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

async function getInternalRegistration(id: string) {
  const registration = await db.orm.public.DataLomba.where({ id }).first();

  if (!registration || registration.jenisLomba !== "FUN_RUN") {
    return null;
  }

  const detail = await db.orm.public.DetailFunRun.where({
    dataLombaId: id,
  }).first();

  if (!detail || detail.kategoriPeserta !== "INTERNAL") {
    return null;
  }

  return { registration, detail };
}

// Membuat signed URL untuk melihat kartu pelajar.
export async function GET(_request: Request, context: Context) {
  try {
    if (!(await verifyAdminSession())) {
      return errorResponse("Tidak memiliki akses.", 401);
    }

    const { id } = await context.params;
    const record = await getInternalRegistration(id);

    if (!record?.detail.buktiKartuPelajarPath) {
      return errorResponse("Bukti kartu pelajar tidak ditemukan.", 404);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET;

    if (!supabaseUrl || !secretKey || !bucket) {
      return errorResponse("Konfigurasi Supabase belum lengkap.", 500);
    }

    const path = record.detail.buktiKartuPelajarPath;
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");

    const url =
      `${supabaseUrl.replace(/\/$/, "")}` +
      `/storage/v1/object/sign/${encodeURIComponent(bucket)}/${encodedPath}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        apikey: secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expiresIn: 300 }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("SIGNED_URL_ERROR:", await response.text());
      return errorResponse("Gagal membuat tautan kartu pelajar.", 502);
    }

    const result = (await response.json()) as {
      signedURL?: string;
    };

    if (!result.signedURL) {
      return errorResponse("Signed URL tidak ditemukan.", 502);
    }

    const signedUrl = result.signedURL.startsWith("http")
      ? result.signedURL
      : `${supabaseUrl.replace(/\/$/, "")}/storage/v1${
          result.signedURL.startsWith("/") ? "" : "/"
        }${result.signedURL}`;

    return NextResponse.json({
      success: true,
      data: { signedUrl },
    });
  } catch (error) {
    console.error("ADMIN_VERIFICATION_GET_ERROR:", error);
    return errorResponse("Terjadi kesalahan server.", 500);
  }
}

async function processInternalPaymentLink(
  registrationId: string,
  detail: {
    namaLengkap: string;
    email: string;
    noWhatsapp: string;
  },
  orderId: string,
  paymentExpiresAt: string | null,
) {
  let paymentUrl: string | null = null;
  let snapToken: string | null = null;

  const current = await db.orm.public.DataLomba.where({
    id: registrationId,
  }).first();

  if (!current) {
    throw new Error("Data pendaftaran tidak ditemukan.");
  }
  if (current.paymentUrl && current.snapToken) {
    paymentUrl = current.paymentUrl;
    snapToken = current.snapToken;

    if (current.paymentLinkStatus === "SENT") {
      return {
        success: true,
        message: "Link pembayaran sudah pernah dikirim.",
        paymentUrl,
      };
    }

    if (
      current.paymentLinkStatus !== "CREATED" &&
      current.paymentLinkStatus !== "SEND_FAILED"
    ) {
      return {
        success: false,
        message: "Status pengiriman link belum dapat diproses.",
        paymentUrl,
      };
    }
  }

  // Jika URL sudah ada, gunakan kembali. Jangan membuat transaksi baru.
  if (current.paymentUrl && current.snapToken) {
    paymentUrl = current.paymentUrl;
    snapToken = current.snapToken;
  } else {
    if (
      current.paymentLinkStatus !== "NOT_CREATED" &&
      current.paymentLinkStatus !== "FAILED"
    ) {
      return {
        success: false,
        message: "Transaksi sedang diproses atau sudah dibuat.",
      };
    }
    // Claim pembuatan transaksi secara atomik.
    // Hanya satu request yang boleh mengubah status menjadi CREATING.
    const claimPlan = db.sql.public.DataLomba.update({
      paymentLinkStatus: "CREATING",
    })
      .where((fields, fns) =>
        fns.and(
          fns.eq(fields.id, registrationId),
          fns.eq(fields.snapToken, null),
          fns.eq(fields.paymentLinkStatus, current.paymentLinkStatus),
          fns.eq(fields.paymentUrl, null),
        ),
      )
      .returning("id")
      .build();

    const claimed = await db.runtime().query(claimPlan);

    if (!claimed.length) {
      return {
        success: false,
        message: "Transaksi sedang diproses oleh request lain.",
      };
    }

    try {
      const snap = await createSnapTransaction({
        transaction_details: {
          order_id: orderId,
          gross_amount: HARGA_FUN_RUN_INTERNAL,
        },
        item_details: [
          {
            id: "FUN_RUN_INTERNAL",
            price: HARGA_FUN_RUN_INTERNAL,
            quantity: 1,
            name: "Pendaftaran Fun Run Internal",
          },
        ],
        customer_details: {
          first_name: detail.namaLengkap,
          email: detail.email,
          phone: detail.noWhatsapp,
        },
      });

      if (!snap.token || !snap.redirect_url) {
        throw new Error("Respons Snap tidak lengkap.");
      }

      snapToken = snap.token;
      paymentUrl = snap.redirect_url;

      const savePlan = db.sql.public.DataLomba.update({
        snapToken,
        paymentUrl,
        paymentLinkCreatedAt: new Date().toISOString(),
        paymentLinkStatus: "CREATED",
        jumlahBayar: HARGA_FUN_RUN_INTERNAL,
      })
        .where((fields, fns) =>
          fns.and(
            fns.eq(fields.id, registrationId),
            fns.eq(fields.paymentLinkStatus, "CREATING"),
          ),
        )
        .returning("id")
        .build();

      const saved = await db.runtime().query(savePlan);

      if (!saved.length) {
        throw new Error("Gagal menyimpan URL pembayaran.");
      }
    } catch (error) {
      const failedPlan = db.sql.public.DataLomba.update({
        paymentLinkStatus: "FAILED",
      })
        .where((fields, fns) => fns.eq(fields.id, registrationId))
        .build();

      await db.runtime().query(failedPlan);

      throw error;
    }
  }

  // Kirim URL pembayaran melalui WhatsApp.
  try {
    const expiryText = paymentExpiresAt
      ? new Date(paymentExpiresAt).toLocaleString("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "Asia/Jakarta",
        })
      : "24 jam setelah persetujuan";

    const message = [
      `Halo, Kak ${detail.namaLengkap}! 👋`,
      "",
      "🎉 *PENDAFTARAN FUN RUN INTERNAL DISETUJUI!*",
      "",
      "Verifikasi kartu pelajar kamu berhasil. Sekarang kamu bisa melanjutkan pembayaran.",
      "",
      `💰 *Biaya pendaftaran: Rp${HARGA_FUN_RUN_INTERNAL.toLocaleString("id-ID")}*`,
      "",
      "👇 *Klik tautan berikut untuk membayar:*",
      paymentUrl,
      "",
      `⏰ Batas pembayaran: ${expiryText}`,
      "",
      "Jika mengalami kendala pembayaran, silakan hubungi panitia Genotif 47.",
      "",
      "Salam kreatif dan inovatif,",
      "Panitia Genotif 47 💙",
    ].join("\n");

    await sendWhatsAppMessage(detail.noWhatsapp, message);

    const sentPlan = db.sql.public.DataLomba.update({
      paymentLinkStatus: "SENT",
      paymentWhatsAppSentAt: new Date().toISOString(),
    })
      .where((fields, fns) => fns.eq(fields.id, registrationId))
      .build();

    await db.runtime().query(sentPlan);

    return {
      success: true,
      message: "URL pembayaran berhasil dikirim.",
      paymentUrl,
    };
  } catch (error) {
    console.error("INTERNAL_PAYMENT_WHATSAPP_ERROR:", {
      registrationId,
      error,
    });

    const failedPlan = db.sql.public.DataLomba.update({
      paymentLinkStatus: "SEND_FAILED",
    })
      .where((fields, fns) => fns.eq(fields.id, registrationId))
      .build();

    await db.runtime().query(failedPlan);

    return {
      success: false,
      message: "Transaksi tersimpan, tetapi WhatsApp gagal dikirim.",
      paymentUrl,
    };
  }
}
// Menyetujui atau menolak pendaftaran.
export async function POST(request: Request, context: Context) {
  try {
    if (!(await verifyAdminSession())) {
      return errorResponse("Tidak memiliki akses.", 401);
    }

    const { id } = await context.params;
    const body = await request.json();

    const decision = body?.decision;
    const note = typeof body?.note === "string" ? body.note.trim() : "";

    if (decision !== "APPROVED" && decision !== "REJECTED") {
      return errorResponse("Keputusan tidak valid.", 400);
    }

    if (decision === "REJECTED" && (note.length < 5 || note.length > 500)) {
      return errorResponse(
        "Alasan penolakan wajib diisi (5–500 karakter).",
        400,
      );
    }

    const record = await getInternalRegistration(id);

    if (!record) {
      return errorResponse(
        "Pendaftaran Fun Run Internal tidak ditemukan.",
        404,
      );
    }

    // Approval sebelumnya sudah berhasil:
    // proses ulang hanya untuk memastikan link pembayaran terkirim.
    if (
      record.detail.statusVerifikasi === "APPROVED" &&
      decision === "APPROVED"
    ) {
      try {
        const payment = await processInternalPaymentLink(
          id,
          {
            namaLengkap: record.detail.namaLengkap,
            email: record.detail.email,
            noWhatsapp: record.detail.noWhatsapp,
          },
          record.registration.orderId,
          record.detail.paymentExpiresAt,
        );

        return NextResponse.json({
          success: payment.success,
          message: payment.message,
          data: {
            statusVerifikasi: "APPROVED",
            paymentUrl: payment.paymentUrl ?? null,
          },
        });
      } catch (error) {
        console.error("INTERNAL_PAYMENT_CREATION_ERROR:", error);

        return NextResponse.json({
          success: true,
          message:
            "Pendaftaran sudah disetujui, tetapi pembuatan transaksi gagal. Silakan coba lagi.",
          data: {
            statusVerifikasi: "APPROVED",
            paymentLinkStatus: "FAILED",
          },
        });
      }
    }

    if (record.detail.statusVerifikasi !== "PENDING") {
      return errorResponse("Pendaftaran sudah diproses sebelumnya.", 409);
    }

    const now = new Date();

    const paymentExpiresAt =
      decision === "APPROVED"
        ? new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        : null;

    const updatePlan = db.sql.public.DetailFunRun.update({
      statusVerifikasi: decision,
      verifiedAt: now.toISOString(),
      verificationNote: decision === "REJECTED" ? note : null,
      paymentExpiresAt,
    })
      .where((fields, fns) =>
        fns.and(
          fns.eq(fields.dataLombaId, id),
          fns.eq(fields.kategoriPeserta, "INTERNAL"),
          fns.eq(fields.statusVerifikasi, "PENDING"),
        ),
      )
      .returning("statusVerifikasi")
      .build();

    const updated = await db.runtime().query(updatePlan);

    if (!updated.length) {
      return errorResponse("Pendaftaran sudah diproses oleh admin lain.", 409);
    }

    // Rejection selesai di sini, tidak membuat transaksi.
    // Rejection selesai di sini, tidak membuat transaksi.
    if (decision === "REJECTED") {
      let whatsappSent = false;

      const message = [
        `Halo, Kak ${record.detail.namaLengkap}.`,
        "",
        "*PEMBERITAHUAN HASIL VERIFIKASI FUN RUN INTERNAL*",
        "",
        "Mohon maaf, pendaftaran Fun Run Internal Genotif 47 belum dapat kami setujui.",
        "",
        `Alasan penolakan: ${note}`,
        "",
        "Jika terdapat kekeliruan dalam proses verifikasi, silakan hubungi panitia Genotif 47.",
        "",
        "Terima kasih atas perhatian dan pengertiannya.",
        "",
        "Panitia Genotif 47 💙",
      ].join("\n");

      try {
        await sendWhatsAppMessage(record.detail.noWhatsapp, message);

        whatsappSent = true;
      } catch (error) {
        console.error("INTERNAL_REJECTION_WHATSAPP_ERROR:", {
          registrationId: id,
          error,
        });
      }

      return NextResponse.json({
        success: true,
        message: whatsappSent
          ? "Pendaftaran berhasil ditolak dan pemberitahuan WhatsApp terkirim."
          : "Pendaftaran berhasil ditolak, tetapi pemberitahuan WhatsApp gagal dikirim.",
        data: {
          statusVerifikasi: decision,
          verifiedAt: now.toISOString(),
          verificationNote: note,
          whatsappSent,
        },
      });
    }

    // Approval berhasil. Lanjutkan membuat transaksi dan mengirim URL.
    try {
      const payment = await processInternalPaymentLink(
        id,
        {
          namaLengkap: record.detail.namaLengkap,
          email: record.detail.email,
          noWhatsapp: record.detail.noWhatsapp,
        },
        record.registration.orderId,
        paymentExpiresAt,
      );

      return NextResponse.json({
        success: true,
        message: payment.message,
        data: {
          statusVerifikasi: "APPROVED",
          paymentUrl: payment.paymentUrl ?? null,
          paymentLinkSent: payment.success,
        },
      });
    } catch (error) {
      console.error("INTERNAL_PAYMENT_CREATION_ERROR:", error);

      return NextResponse.json({
        success: true,
        message:
          "Pendaftaran disetujui, tetapi pembuatan transaksi gagal. Admin dapat mencoba kembali.",
        data: {
          statusVerifikasi: "APPROVED",
          paymentLinkStatus: "FAILED",
        },
      });
    }
  } catch (error) {
    console.error("ADMIN_VERIFICATION_POST_ERROR:", error);
    return errorResponse("Terjadi kesalahan server.", 500);
  }
}
