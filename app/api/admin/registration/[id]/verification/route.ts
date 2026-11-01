import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin/auth";
import { db } from "@/src/prisma/db";

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

    if (record.detail.statusVerifikasi !== "PENDING") {
      return errorResponse("Pendaftaran sudah diproses sebelumnya.", 409);
    }

    const now = new Date();

    const paymentExpiresAt =
      decision === "APPROVED"
        ? new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        : null;

    // Conditional update: mencegah dua admin memproses
    // pendaftaran yang sama secara bersamaan.
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

    return NextResponse.json({
      success: true,
      message:
        decision === "APPROVED"
          ? "Pendaftaran berhasil disetujui."
          : "Pendaftaran berhasil ditolak.",
      data: {
        statusVerifikasi: decision,
        verifiedAt: now.toISOString(),
        paymentExpiresAt,
        verificationNote: decision === "REJECTED" ? note : null,
      },
    });
  } catch (error) {
    console.error("ADMIN_VERIFICATION_POST_ERROR:", error);
    return errorResponse("Terjadi kesalahan server.", 500);
  }
}
