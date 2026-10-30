import { db } from "@/src/prisma/db";

function normalizeStatus(status: unknown): string {
  return String(status ?? "PENDING").toUpperCase();
}

function formatNamaPeserta(
  jenisLomba: string,
  detail: {
    namaLengkap?: string;
    namaPerwakilan?: string;
    namaSekolah?: string;
    namaPeserta?: string;
  } | null,
): string {
  if (!detail) return "—";

  switch (jenisLomba) {
    case "FUN_RUN":
      return detail.namaLengkap ?? "—";
    case "STMS":
      return detail.namaPerwakilan ?? "—";
    case "CERDAS_CERMAT":
      return detail.namaSekolah ?? "—";
    case "MEWARNAI":
      return detail.namaPeserta ?? "—";
    default:
      return "—";
  }
}

async function getNamaDanEmail(item: { id: string; jenisLomba: string }) {
  switch (item.jenisLomba) {
    case "FUN_RUN": {
      const detail = await db.orm.public.DetailFunRun.where({
        dataLombaId: item.id,
      }).first();

      return {
        namaPeserta: detail?.namaLengkap ?? "—",
        email: detail?.email ?? "—",
      };
    }

    case "STMS": {
      const detail = await db.orm.public.DetailSTMS.where({
        dataLombaId: item.id,
      }).first();

      return {
        namaPeserta: detail?.namaPerwakilan ?? "—",
        email: detail?.email ?? "—",
      };
    }

    case "CERDAS_CERMAT": {
      const detail = await db.orm.public.DetailCerdasCermat.where({
        dataLombaId: item.id,
      }).first();

      return {
        namaPeserta: detail?.namaSekolah ?? "—",
        email: detail?.emailPendamping ?? "—",
      };
    }

    case "MEWARNAI": {
      const detail = await db.orm.public.DetailMewarnai.where({
        dataLombaId: item.id,
      }).first();

      return {
        namaPeserta: detail?.namaPeserta ?? "—",
        email: detail?.emailOrangTua ?? "—",
      };
    }

    default:
      return {
        namaPeserta: "—",
        email: "—",
      };
  }
}

export async function getAdminDashboardData() {
  const pendaftaran = await db.orm.public.DataLomba.where({}).all();

  const normalizedStatuses = pendaftaran.map((item) =>
    normalizeStatus(item.statusBayar),
  );

  const totalPending = normalizedStatuses.filter(
    (status) => status === "PENDING",
  ).length;

  const totalPaid = normalizedStatuses.filter(
    (status) => status === "PAID",
  ).length;

  const jenisLombaAktif = new Set(pendaftaran.map((item) => item.jenisLomba))
    .size;

  const terbaru = [...pendaftaran]
    .sort(
      (a, b) =>
        new Date(String(b.createdAt)).getTime() -
        new Date(String(a.createdAt)).getTime(),
    )
    .slice(0, 8);

  const pendaftaranDenganDetail = await Promise.all(
    terbaru.map(async (item) => {
      const { namaPeserta, email } = await getNamaDanEmail({
        id: item.id,
        jenisLomba: String(item.jenisLomba),
      });

      return {
        id: item.id,
        namaPeserta,
        email,
        jenisLomba: String(item.jenisLomba),
        orderId: String(item.orderId),
        statusBayar: normalizeStatus(item.statusBayar),
        createdAt: item.createdAt,
        checkedInAt: item.checkedInAt ? item.checkedInAt.toString() : null,
      };
    }),
  );

  return {
    // Model Peserta sudah tidak ada.
    // Angka ini merepresentasikan total pendaftaran individu/tim.
    totalPeserta: pendaftaran.length,
    totalPendaftaran: pendaftaran.length,
    totalPending,
    totalPaid,
    jenisLombaAktif,
    pendaftaran: pendaftaranDenganDetail,
  };
}

export async function getAdminRegistrations() {
  const pendaftaran = await db.orm.public.DataLomba.where({}).all();

  const result = await Promise.all(
    pendaftaran.map(async (item) => {
      const { namaPeserta, email } = await getNamaDanEmail({
        id: item.id,
        jenisLomba: String(item.jenisLomba),
      });

      let noWhatsapp = "—";

      switch (item.jenisLomba) {
        case "FUN_RUN": {
          const detail = await db.orm.public.DetailFunRun.where({
            dataLombaId: item.id,
          }).first();
          noWhatsapp = detail?.noWhatsapp ?? "—";
          break;
        }

        case "STMS": {
          const detail = await db.orm.public.DetailSTMS.where({
            dataLombaId: item.id,
          }).first();
          noWhatsapp = detail?.noWhatsapp ?? "—";
          break;
        }

        case "CERDAS_CERMAT": {
          const detail = await db.orm.public.DetailCerdasCermat.where({
            dataLombaId: item.id,
          }).first();
          noWhatsapp = detail?.whatsappPendamping ?? "—";
          break;
        }

        case "MEWARNAI": {
          const detail = await db.orm.public.DetailMewarnai.where({
            dataLombaId: item.id,
          }).first();
          noWhatsapp = detail?.whatsappOrangTua ?? "—";
          break;
        }
      }

      return {
        id: item.id,
        namaLengkap: namaPeserta,
        email,
        noWhatsapp,
        jenisLomba: String(item.jenisLomba),
        orderId: String(item.orderId),
        statusBayar: normalizeStatus(item.statusBayar),
        createdAt: item.createdAt.toString(),
        checkedInAt: item.checkedInAt ? item.checkedInAt.toString() : null,
      };
    }),
  );

  return result.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getAdminRegistrationDetail(id: string) {
  // 1. Ambil data registrasi utama berdasarkan DataLomba.id
  const pendaftaran = await db.orm.public.DataLomba.where({ id }).first();

  if (!pendaftaran) return null;

  const jenisLomba = String(pendaftaran.jenisLomba);

  // 2. Data umum pendaftar dan detail lomba
  let namaPeserta = "—";
  let email = "—";
  let noWhatsapp = "—";

  let detail: Record<string, string | number | boolean | null> | null = null;

  let anggota: Array<{
    id: string;
    namaLengkap: string;
    kelas?: string;
  }> = [];

  // 3. Ambil detail sesuai jenis lomba
  switch (jenisLomba) {
    case "FUN_RUN": {
      const result = await db.orm.public.DetailFunRun.where({
        dataLombaId: pendaftaran.id,
      }).first();

      if (result) {
        namaPeserta = result.namaLengkap;
        email = result.email;
        noWhatsapp = result.noWhatsapp;

        detail = {
          jenisKelamin: result.jenisKelamin,
          kontakDarurat: result.kontakDarurat,
        };
      }

      break;
    }

    case "STMS": {
      const result = await db.orm.public.DetailSTMS.where({
        dataLombaId: pendaftaran.id,
      }).first();

      if (result) {
        namaPeserta = result.namaPerwakilan;
        email = result.email;
        noWhatsapp = result.noWhatsapp;

        detail = {
          kelas: result.kelas,
          jenisBakat: result.jenisBakat,
          jumlahAnggota: result.jumlahAnggota,
          perlengkapan: result.perlengkapan,
          menggunakanMusik: result.menggunakanMusik,
        };

        // Anggota terhubung ke DetailSTMS, bukan langsung ke DataLomba
        const members = await db.orm.public.AnggotaSTMS.where({
          detailSTMSId: result.id,
        }).all();

        anggota = members.map((member) => ({
          id: member.id,
          namaLengkap: member.namaLengkap,
        }));
      }

      break;
    }

    case "CERDAS_CERMAT": {
      const result = await db.orm.public.DetailCerdasCermat.where({
        dataLombaId: pendaftaran.id,
      }).first();

      if (result) {
        namaPeserta = result.namaSekolah;
        email = result.emailPendamping;
        noWhatsapp = result.whatsappPendamping;

        detail = {
          alamatSekolah: result.alamatSekolah,
          namaGuruPendamping: result.namaGuruPendamping,
        };

        // Anggota terhubung ke DetailCerdasCermat
        const members = await db.orm.public.AnggotaCerdasCermat.where({
          detailCerdasCermatId: result.id,
        }).all();

        anggota = members.map((member) => ({
          id: member.id,
          namaLengkap: member.namaLengkap,
          kelas: member.kelas,
        }));
      }

      break;
    }

    case "MEWARNAI": {
      const result = await db.orm.public.DetailMewarnai.where({
        dataLombaId: pendaftaran.id,
      }).first();

      if (result) {
        namaPeserta = result.namaPeserta;
        email = result.emailOrangTua;
        noWhatsapp = result.whatsappOrangTua;

        detail = {
          asalSekolah: result.asalSekolah,
          kelas: result.kelas,
          usia: result.usia,
          namaOrangTua: result.namaOrangTua,
          paketLomba: result.paketLomba,
        };
      }

      break;
    }
  }

  // 4. Kembalikan data dalam struktur yang digunakan page.tsx
  return {
    id: pendaftaran.id,
    jenisLomba,
    orderId: String(pendaftaran.orderId),
    statusBayar: normalizeStatus(pendaftaran.statusBayar),
    checkedInAt: pendaftaran.checkedInAt
      ? pendaftaran.checkedInAt.toString()
      : null,

    peserta: {
      namaLengkap: namaPeserta,
      email,
      noWhatsapp,
    },

    detail,
    anggota,
  };
}
