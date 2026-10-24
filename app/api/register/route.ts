import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations/register";
import { db } from "@/src/prisma/db";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const validation = registrationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Data form tidak valid.", issues: validation.error.issues }, { status: 400 });
    }

    const data = validation.data;
    const lomba = await db.orm.public.DataLomba.create({
      jenisLomba: data.jenisLomba,
      statusBayar: "PENDING",
    });

    switch (data.jenisLomba) {
      case "FUN_RUN":
        await db.orm.public.DetailFunRun.create({
          namaLengkap: data.namaLengkap,
          jenisKelamin: data.jenisKelamin,
          kontakDarurat: data.kontakDarurat,
          email: data.email,
          noWhatsapp: data.noWhatsapp,
          dataLombaId: lomba.id,
        });
        break;

      case "STMS": {
        const detail = await db.orm.public.DetailSTMS.create({
          namaPerwakilan: data.namaPerwakilan,
          kelas: data.kelas,
          jenisBakat: data.jenisBakat,
          jumlahAnggota: data.jumlahAnggota,
          perlengkapan: data.perlengkapan || null,
          menggunakanMusik: data.menggunakanMusik,
          dataLombaId: lomba.id,
        });
        for (const anggota of data.anggota) {
          await db.orm.public.AnggotaSTMS.create({ namaLengkap: anggota.namaLengkap, detailSTMSId: detail.id });
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
        for (const anggota of data.anggota) {
          await db.orm.public.AnggotaCerdasCermat.create({
            namaLengkap: anggota.namaLengkap,
            kelas: anggota.kelas,
            detailCerdasCermatId: detail.id,
          });
        }
        break;
      }

      case "MEWARNAI":
        await db.orm.public.DetailMewarnai.create({
          namaPeserta: data.namaPeserta,
          asalSekolah: data.asalSekolah,
          kelas: data.kelas,
          usia: data.usia,
          namaOrangTua: data.namaOrangTua,
          whatsappOrangTua: data.whatsappOrangTua,
          emailOrangTua: data.emailOrangTua,
          paketLomba: data.paketLomba,
          dataLombaId: lomba.id,
        });
        break;
    }

    return NextResponse.json({ success: true, message: "Pendaftaran berhasil disimpan.", data: { id: lomba.id, orderId: lomba.orderId, jenisLomba: data.jenisLomba } }, { status: 201 });
  } catch (error: unknown) {
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json({
      error: "Gagal menyimpan pendaftaran.",
      details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : "Kesalahan tidak diketahui.") : undefined,
    }, { status: 500 });
  }
}
