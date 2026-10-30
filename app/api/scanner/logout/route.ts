import { NextResponse } from "next/server";
import { destroyScannerSession } from "@/lib/scanner/sesion";

export const runtime = "nodejs";

export async function POST() {
  try {
    await destroyScannerSession();

    return NextResponse.json({
      success: true,
      message: "Logout berhasil.",
    });
  } catch (error) {
    console.error("[SCANNER_LOGOUT]", error);

    return NextResponse.json(
      { message: "Gagal melakukan logout." },
      { status: 500 },
    );
  }
}
