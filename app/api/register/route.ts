// app/api/register/route.ts
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/register";
import { db } from "@/src/prisma/db"; // Import client bawaan Prisma 8

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validasi Input lewat Zod
    const validatedData = registerSchema.parse(body);

    // 2. Cek email terdaftar menggunakan .where().first()
    const existingPeserta = await db.orm.public.Peserta.where({
      email: validatedData.email,
    }).first();

    if (existingPeserta) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar!" },
        { status: 400 },
      );
    }

    // 3. Simpan data Peserta
    const newPeserta = await db.orm.public.Peserta.create({
      namaLengkap: validatedData.namaLengkap,
      email: validatedData.email,
      noWhatsapp: validatedData.noWhatsapp,
      asalSekolah: validatedData.asalSekolah,
    });

    // 4. Simpan data Lomba (relasi via pesertaId)
    const newLomba = await db.orm.public.DataLomba.create({
      jenisLomba: validatedData.jenisLomba,
      statusBayar: "PENDING",
      pesertaId: newPeserta.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil!",
        data: {
          ...newPeserta,
          lomba: newLomba,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Data form tidak valid", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
