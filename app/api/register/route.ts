import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createSnapTransaction } from "@/lib/validations/midtrans";
import { getHargaLomba, HARGA_FUN_RUN_INTERNAL } from "@/lib/pra-event/price";
import type { RegistrationInput } from "@/lib/validations/register";
import {
  generateRegistrationId,
  formatDetailId,
  formatMemberId,
} from "@/lib/validations/registration-id";
import { registrationSchema } from "@/lib/validations/register";
import { db } from "@/src/prisma/db";

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

          kategoriPeserta: data.kategoriPeserta,

          kelas: data.kategoriPeserta === "INTERNAL" ? data.kelas! : null,

          buktiKartuPelajarPath:
            data.kategoriPeserta === "INTERNAL"
              ? data.buktiKartuPelajarPath!
              : null,

          statusVerifikasi:
            data.kategoriPeserta === "INTERNAL" ? "PENDING" : "NOT_REQUIRED",

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
    // Peserta Internal menunggu verifikasi admin.
    // Transaksi Midtrans belum dibuat pada tahap ini.
    if (data.jenisLomba === "FUN_RUN" && data.kategoriPeserta === "INTERNAL") {
      return NextResponse.json(
        {
          success: true,
          message:
            "Pendaftaran berhasil. Silakan menunggu verifikasi kartu pelajar oleh panitia.",
          data: {
            lomba: newLomba,
            paymentRequired: false,
            statusVerifikasi: "PENDING",
          },
        },
        { status: 201 },
      );
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

    const basePrice = getHargaLomba(newLomba.jenisLomba);
    const transaction = await createSnapTransaction({
      transaction_details: {
        order_id: newLomba.orderId,
        gross_amount: basePrice,
      },
      item_details: [
        {
          id: `registration-${newLomba.jenisLomba}`,
          price: basePrice,
          quantity: 1,
          name: `Biaya Pendaftaran ${newLomba.jenisLomba}`,
        },
      ],
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
