import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations/register";
import { db } from "@/src/prisma/db";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    // 1. Validasi data dari frontend
    const validation = registrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Data form tidak valid.",
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const data = validation.data;

    // 2. Cek email yang sudah terdaftar
    const existingPeserta = await db.orm.public.Peserta.where({
      email: data.email,
    }).first();

    if (existingPeserta) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar!" },
        { status: 409 },
      );
    }

    // 3. Simpan data peserta
    const newPeserta = await db.orm.public.Peserta.create({
      namaLengkap: data.namaLengkap,
      email: data.email,
      noWhatsapp: data.noWhatsapp,
    });

    // 4. Simpan data lomba utama
    const newLomba = await db.orm.public.DataLomba.create({
      jenisLomba: data.jenisLomba,
      statusBayar: "PENDING",
      pesertaId: newPeserta.id,
    });

    // 5. Simpan detail sesuai jenis lomba
    switch (data.jenisLomba) {
      case "FUN_RUN": {
        // Belum ada model DetailFunRun di schema.
        // Tidak ada jenisKelamin atau kontakDarurat.
        break;
      }

      case "STMS": {
        const detail = await db.orm.public.DetailSTMS.create({
          kelas: data.kelas,
          jenisBakat: data.jenisBakat,
          jumlahAnggota: data.jumlahAnggota,
          perlengkapan: data.perlengkapan || null,
          menggunakanMusik: data.menggunakanMusik,
          dataLombaId: newLomba.id,
        });

        // Simpan nama anggota tambahan satu per satu.
        for (const anggota of data.anggota) {
          await db.orm.public.AnggotaSTMS.create({
            namaLengkap: anggota.namaLengkap,
            detailSTMSId: detail.id,
          });
        }

        break;
      }

      case "CERDAS_CERMAT": {
        const detail = await db.orm.public.DetailCerdasCermat.create({
          namaSekolah: data.namaSekolah,
          alamatSekolah: data.alamatSekolah,
          namaGuruPendamping: data.namaGuruPendamping,
          whatsappPendamping: data.whatsappPendamping,
          dataLombaId: newLomba.id,
        });

        // Schema mewajibkan kolom jabatan.
        // Karena form belum meminta jabatan, gunakan nilai default.
        for (const [index, anggota] of data.anggota.entries()) {
          await db.orm.public.AnggotaCerdasCermat.create({
            namaLengkap: anggota.namaLengkap,
            kelas: anggota.kelas,
            jabatan: index === 0 ? "KETUA" : "ANGGOTA",
            detailCerdasCermatId: detail.id,
          });
        }

        break;
      }

      case "MEWARNAI": {
        await db.orm.public.DetailMewarnai.create({
          asalSekolah: data.asalSekolah,
          kelas: data.kelas,
          tanggalLahir: data.tanggalLahir
            ? Temporal.Instant.from(`${data.tanggalLahir}T00:00:00Z`)
            : null,
          usia: data.usia ?? null,
          paketLomba: data.paketLomba,
          namaOrangTua: data.namaOrangTua,
          whatsappOrangTua: data.whatsappOrangTua,
          dataLombaId: newLomba.id,
        });

        break;
      }
    }

    // 6. Respons sukses
    return NextResponse.json(
      {
        success: true,
        message: "Registrasi dan detail lomba berhasil disimpan.",
        data: {
          id: newPeserta.id,
          namaLengkap: newPeserta.namaLengkap,
          email: newPeserta.email,
          noWhatsapp: newPeserta.noWhatsapp,
          lomba: newLomba,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("REGISTER_ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Kesalahan tidak diketahui.";

    return NextResponse.json(
      {
        error: "Gagal menyimpan pendaftaran.",
        // Berguna untuk debugging lokal.
        // Jangan tampilkan detail internal ini ke publik di production.
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}
