import { NextResponse } from "next/server";
import { destroyAdminSession } from "@/lib/admin/auth";

export async function POST() {
  try {
    await destroyAdminSession();

    return NextResponse.json({
      message: "Logout berhasil.",
    });
  } catch {
    return NextResponse.json(
      { message: "Logout gagal. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
