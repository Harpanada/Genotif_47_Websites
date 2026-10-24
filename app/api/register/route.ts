import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations/register";
import { db } from "@/src/prisma/db";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const validation = registrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Data form tidak valid.", issues: validation.error.issues },
        { status: 400 },
      );
    }

    const data = validation.data;

    // Email bukan identitas unik peserta; setiap pendaftaran tetap memiliki
    // satu DataLomba/order sendiri.
    const peserta = await db.orm.public.Peserta.create({
      namaLengkap: data.namaLengkap,
      email: data.email,
      noWhatsapp: data.noWhatsapp,
    });

    const lomba = await db.orm.public.DataLomba.create({
      jenisLomba: data.jenisLomba,
      statusBayar: "PENDING",
      pesertaId: peserta.id,
    });

    switch (data.jenisLomba) {
      case "FUN_RUN": {
        await db.orm.public.DetailFunRun.create({
          jenisKelamin: data.jenisKelamin,
          kontakDarurat: data.kontakDarurat,
          dataLombaId: lomba.id,
        });
        break;
      }
      case "STMS": {
        const detail = await db.orm.public.DetailSTMS.create({
          kelas: data.kelas,
          jenisBakat: data.jenisBakat,
          jumlahAnggota: data.jumlahAnggota,
          perlengkapan: data.perlengkapan || null,
          menggunakanMusik: data.menggunakanMusik,
          dataLombaId: lomba.id,
        });
        // Perwakilan disimpan di Peserta dan dihitung sebagai anggota pertama.
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
          emailPendamping: data.emailPendamping,
          whatsappPendamping: data.whatsappPendamping,
          dataLombaId: lomba.id,
        });
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
          tanggalLahir: data.tanggalLahir ? new Date(`${data.tanggalLahir}T00:00:00.000Z`) : null,
          usia: data.usia ?? null,
          paketLomba: data.paketLomba,
          namaOrangTua: data.namaOrangTua,
          emailOrangTua: data.emailOrangTua,
          whatsappOrangTua: data.whatsappOrangTua,
          dataLombaId: lomba.id,
        });
        break;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil disimpan.",
      data: {
        id: peserta.id,
        namaLengkap: peserta.namaLengkap,
        email: peserta.email,
        noWhatsapp: peserta.noWhatsapp,
        lomba,
      },
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json({
      error: "Gagal menyimpan pendaftaran.",
      details: process.env.NODE_ENV === "development"
        ? (error instanceof Error ? error.message : "Kesalahan tidak diketahui.")
        : undefined,
    }, { status: 500 });
  }
}
