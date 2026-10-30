import { NextResponse } from "next/server";
import { getScannerSession, destroyScannerSession } from "@/lib/scanner/sesion";
import { getScannerAccountById } from "@/lib/scanner/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getScannerSession();

    if (!session) {
      return NextResponse.json(
        { message: "Sesi tidak ditemukan." },
        { status: 401 },
      );
    }

    // Periksa kembali akun di database agar akun yang dinonaktifkan
    // tidak tetap bisa menggunakan sesi lama.
    const account = await getScannerAccountById(session.accountId);

    if (!account) {
      await destroyScannerSession();

      return NextResponse.json(
        { message: "Akun tidak aktif atau tidak ditemukan." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        username: account.username,
        nama: account.nama,
        role: account.role,
      },
    });
  } catch (error) {
    console.error("[SCANNER_SESSION]", error);

    return NextResponse.json(
      { message: "Gagal memvalidasi sesi." },
      { status: 500 },
    );
  }
}
