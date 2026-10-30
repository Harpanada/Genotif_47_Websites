import { NextResponse } from "next/server";
import { getScannerSession } from "@/lib/scanner/sesion";
import { getScannerAccountById } from "@/lib/scanner/auth";
import { processCheckIn } from "@/lib/scanner/checkin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getScannerSession();

    if (!session) {
      return NextResponse.json(
        { message: "Sesi tidak valid. Silakan login kembali." },
        { status: 401 },
      );
    }

    const account = await getScannerAccountById(session.accountId);

    if (!account) {
      return NextResponse.json(
        { message: "Akun panitia tidak aktif." },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json(
        {
          status: "INVALID",
          message: "QR code tidak memiliki token yang valid.",
        },
        { status: 400 },
      );
    }

    const result = await processCheckIn(token, account.id);

    const httpStatus =
      result.status === "INVALID"
        ? 404
        : result.status === "UNPAID"
          ? 409
          : 200;

    return NextResponse.json(result, { status: httpStatus });
  } catch (error) {
    console.error("[SCANNER_SCAN]", error);

    return NextResponse.json(
      {
        status: "ERROR",
        message: "Terjadi kesalahan saat memproses QR.",
      },
      { status: 500 },
    );
  }
}
