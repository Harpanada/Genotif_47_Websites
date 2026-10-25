import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createSnapTransaction, snap } from "@/lib/midtrans";
import { getHargaLomba } from "@/lib/pra-event/price";
import type { RegistrationInput } from "@/lib/validations/register";
import {
  generateRegistrationId,
  formatDetailId,
  formatMemberId,
} from "@/lib/registration-id";
import { registrationSchema } from "@/lib/validations/register";
import { db } from "@/src/prisma/db";

type JenisLomba = "FUN_RUN" | "STMS" | "CERDAS_CERMAT" | "MEWARNAI";

const LOMBA_CONFIG: Record<JenisLomba, { sequence: string; prefix: string }> = {
  FUN_RUN: {
    sequence: "seq_pe_fun_run",
    prefix: "G47-PEFR",
  },
  STMS: {
    sequence: "seq_pe_stms",
    prefix: "G47-PESTMS",
  },
  CERDAS_CERMAT: {
    sequence: "seq_pe_lcc",
    prefix: "G47-PELCC",
  },
  MEWARNAI: {
    sequence: "seq_pe_mewarnai",
    prefix: "G47-PEMW",
  },
};

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

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
    const jenisLomba = data.jenisLomba;

    // 1. Generate ID utama.
    const registrationId = await generateRegistrationId(jenisLomba);

    // 2. Simpan data lomba utama.
    const newLomba = await db.orm.public.DataLomba.create({
      id: registrationId,
      jenisLomba,
      statusBayar: "PENDING",
      orderId: randomUUID(),
      paymentUrl: null,
    });

    const detailId = formatDetailId(registrationId);

    // 3. Simpan detail sesuai jenis lomba.
    switch (jenisLomba) {
      case "FUN_RUN": {
        await db.orm.public.DetailFunRun.create({
          id: detailId,
          namaLengkap: data.namaLengkap,
          jenisKelamin: data.jenisKelamin,
          kontakDarurat: data.kontakDarurat,
          email: data.email,
          noWhatsapp: data.noWhatsapp,
          dataLombaId: newLomba.id,
        });

        break;
      }

      case "STMS": {
        const detail = await db.orm.public.DetailSTMS.create({
          id: detailId,
          namaPerwakilan: data.namaPerwakilan,
          kelas: data.kelas,
          jenisBakat: data.jenisBakat,
          jumlahAnggota: data.jumlahAnggota,
          perlengkapan: data.perlengkapan.trim() || null,
          menggunakanMusik: data.menggunakanMusik,
          email: data.email,
          noWhatsapp: data.noWhatsapp,
          dataLombaId: newLomba.id,
        });

        for (const [index, anggota] of data.anggota.entries()) {
          await db.orm.public.AnggotaSTMS.create({
            id: formatMemberId(registrationId, index + 1),
            namaLengkap: anggota.namaLengkap,
            detailSTMSId: detail.id,
          });
        }

        break;
      }

      case "CERDAS_CERMAT": {
        const detail = await db.orm.public.DetailCerdasCermat.create({
          id: detailId,
          namaSekolah: data.namaSekolah,
          alamatSekolah: data.alamatSekolah,
          namaGuruPendamping: data.namaGuruPendamping,
          emailPendamping: data.emailPendamping,
          whatsappPendamping: data.whatsappPendamping,
          dataLombaId: newLomba.id,
        });

        for (const [index, anggota] of data.anggota.entries()) {
          await db.orm.public.AnggotaCerdasCermat.create({
            id: formatMemberId(registrationId, index + 1),
            namaLengkap: anggota.namaLengkap,
            kelas: anggota.kelas,
            detailCerdasCermatId: detail.id,
          });
        }

        break;
      }

      case "MEWARNAI": {
        await db.orm.public.DetailMewarnai.create({
          id: detailId,
          namaPeserta: data.namaPeserta,
          asalSekolah: data.asalSekolah,
          kelas: data.kelas,
          usia: data.usia,
          namaOrangTua: data.namaOrangTua,
          whatsappOrangTua: data.whatsappOrangTua,
          emailOrangTua: data.emailOrangTua,
          paketLomba: data.paketLomba,
          dataLombaId: newLomba.id,
        });

        break;
      }
    }

    function getCustomerDetails(data: RegistrationInput) {
      switch (data.jenisLomba) {
        case "FUN_RUN":
          return {
            first_name: data.namaLengkap,
            email: data.email,
            phone: data.noWhatsapp,
          };

        case "STMS":
          return {
            first_name: data.namaPerwakilan,
            email: data.email,
            phone: data.noWhatsapp,
          };

        case "CERDAS_CERMAT":
          return {
            first_name: data.namaGuruPendamping,
            email: data.emailPendamping,
            phone: data.whatsappPendamping,
          };

        case "MEWARNAI":
          return {
            first_name: data.namaPeserta,
            email: data.emailOrangTua,
            phone: data.whatsappOrangTua,
          };
      }
    }

    const grossAmount = getHargaLomba(newLomba.jenisLomba);

    const transaction = await createSnapTransaction({
      transaction_details: {
        order_id: newLomba.orderId,
        gross_amount: grossAmount,
      },
      customer_details: getCustomerDetails(data),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil disimpan.",
        data: {
          lomba: newLomba,
          token: transaction.token,
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
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}
