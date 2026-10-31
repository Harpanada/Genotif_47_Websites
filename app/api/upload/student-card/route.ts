import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_TYPES = {
  "image/jpeg": {
    extension: "jpg",
  },
  "image/png": {
    extension: "png",
  },
  "image/webp": {
    extension: "webp",
  },
} as const;

function isValidImage(buffer: Buffer, mimeType: string): boolean {
  switch (mimeType) {
    case "image/jpeg":
      return (
        buffer.length >= 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff
      );

    case "image/png":
      return (
        buffer.length >= 8 &&
        buffer
          .subarray(0, 8)
          .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      );

    case "image/webp":
      return (
        buffer.length >= 12 &&
        buffer.toString("ascii", 0, 4) === "RIFF" &&
        buffer.toString("ascii", 8, 12) === "WEBP"
      );

    default:
      return false;
  }
}

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET;

    if (!supabaseUrl || !supabaseSecretKey || !bucket) {
      console.error("Supabase Storage environment variables are incomplete.");

      return NextResponse.json(
        { error: "Konfigurasi penyimpanan belum lengkap." },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File kartu pelajar wajib diunggah." },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "File tidak boleh kosong." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5 MB." },
        { status: 400 },
      );
    }

    if (!(file.type in ALLOWED_TYPES)) {
      return NextResponse.json(
        { error: "Format file harus JPG, PNG, atau WEBP." },
        { status: 400 },
      );
    }

    const mimeType = file.type as keyof typeof ALLOWED_TYPES;
    const extension = ALLOWED_TYPES[mimeType].extension;

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!isValidImage(buffer, mimeType)) {
      return NextResponse.json(
        { error: "Isi file tidak sesuai dengan format gambar." },
        { status: 400 },
      );
    }

    // Nama acak agar nama file tidak mudah ditebak.
    const filePath = `pending/${randomUUID()}.${extension}`;

    const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");

    const encodedBucket = encodeURIComponent(bucket);

    const uploadUrl =
      `${supabaseUrl.replace(/\/$/, "")}` +
      `/storage/v1/object/${encodedBucket}/${encodedPath}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseSecretKey}`,
        apikey: supabaseSecretKey,
        "Content-Type": mimeType,
        "Cache-Control": "3600",
        "x-upsert": "false",
      },
      body: new Uint8Array(buffer),
      cache: "no-store",
    });

    if (!uploadResponse.ok) {
      const errorDetails = await uploadResponse.text();

      console.error("SUPABASE_UPLOAD_ERROR:", errorDetails);

      return NextResponse.json(
        { error: "Gagal mengunggah kartu pelajar." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Kartu pelajar berhasil diunggah.",
        data: {
          path: filePath,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("STUDENT_CARD_UPLOAD_ERROR:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah kartu pelajar." },
      { status: 500 },
    );
  }
}
