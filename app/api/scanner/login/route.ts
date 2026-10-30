import { NextResponse } from "next/server";
import { authenticateScanner } from "@/lib/scanner/auth";
import { createScannerSession } from "@/lib/scanner/sesion";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string" ? body.username.trim() : "";

    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password || username.length > 50) {
      return NextResponse.json(
        { message: "Username atau password tidak valid." },
        { status: 400 },
      );
    }

    const account = await authenticateScanner(username, password);

    if (!account) {
      return NextResponse.json(
        { message: "Username atau password salah." },
        { status: 401 },
      );
    }

    await createScannerSession({
      accountId: account.id,
      username: account.username,
      nama: account.nama,
      role: account.role,
    });

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: {
        username: account.username,
        nama: account.nama,
        role: account.role,
      },
    });
  } catch (error) {
    console.error("[SCANNER_LOGIN]", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}
