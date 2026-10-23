import { db } from "@/src/prisma/db";

export async function getAdminDashboardData() {
  const [peserta, pendaftaran] = await Promise.all([
    db.orm.public.Peserta.where({}).all(),
    db.orm.public.DataLomba.where({}).include("peserta").all(),
  ]);

  const normalizedStatuses = pendaftaran.map((item) =>
    String(item.statusBayar ?? "UNKNOWN").toUpperCase(),
  );

  const totalPending = normalizedStatuses.filter(
    (status) => status === "PENDING",
  ).length;

  const totalPaid = normalizedStatuses.filter(
    (status) => status === "SETTLEMENT" || status === "CAPTURE",
  ).length;

  const jenisLombaAktif = new Set(pendaftaran.map((item) => item.jenisLomba))
    .size;

  return {
    totalPeserta: peserta.length,
    totalPendaftaran: pendaftaran.length,
    totalPending,
    totalPaid,
    jenisLombaAktif,
    pendaftaran: pendaftaran.slice(0, 8),
  };
}

export async function getAdminRegistrations() {
  const pendaftaran = await db.orm.public.DataLomba.where({})
    .include("peserta")
    .all();

  return pendaftaran.map((item) => ({
    id: item.id,
    namaLengkap: item.peserta?.namaLengkap ?? "—",
    email: item.peserta?.email ?? "—",
    noWhatsapp: item.peserta?.noWhatsapp ?? "—",
    jenisLomba: String(item.jenisLomba),
    orderId: String(item.orderId),
    statusBayar: String(item.statusBayar ?? "PENDING").toUpperCase(),
  }));
}

export async function getAdminRegistrationDetail(id: string) {
  const pendaftaran = await db.orm.public.DataLomba.where({ id })
    .include("peserta")
    .first();

  if (!pendaftaran) {
    return null;
  }

  const jenisLomba = String(pendaftaran.jenisLomba);
  let detail: Record<string, string | number | boolean | null> | null = null;
  let anggota: Array<{
    namaLengkap: string;
    kelas?: string;
    jabatan?: string;
  }> = [];

  if (jenisLomba === "STMS" || jenisLomba === "TALENT_SHOW") {
    const result = await db.orm.public.DetailSTMS.where({
      dataLombaId: pendaftaran.id,
    }).first();

    if (result) {
      detail = {
        jenisBakat: result.jenisBakat,
        jumlahAnggota: result.jumlahAnggota,
        kelas: result.kelas,
        menggunakanMusik: result.menggunakanMusik,
        perlengkapan: result.perlengkapan,
      };

      const members = await db.orm.public.AnggotaSTMS.where({
        detailSTMSId: result.id,
      }).all();

      anggota = members.map((member) => ({
        namaLengkap: member.namaLengkap,
      }));
    }
  } else if (jenisLomba === "LCC_SD" || jenisLomba === "CERDAS_CERMAT") {
    const result = await db.orm.public.DetailCerdasCermat.where({
      dataLombaId: pendaftaran.id,
    }).first();

    if (result) {
      detail = {
        namaSekolah: result.namaSekolah,
        alamatSekolah: result.alamatSekolah,
        namaGuruPendamping: result.namaGuruPendamping,
        whatsappPendamping: result.whatsappPendamping,
      };

      const members = await db.orm.public.AnggotaCerdasCermat.where({
        detailCerdasCermatId: result.id,
      }).all();

      anggota = members.map((member) => ({
        namaLengkap: member.namaLengkap,
        kelas: member.kelas,
        jabatan: member.jabatan,
      }));
    }
  } else if (jenisLomba === "MEWARNAI") {
    const result = await db.orm.public.DetailMewarnai.where({
      dataLombaId: pendaftaran.id,
    }).first();

    if (result) {
      detail = {
        asalSekolah: result.asalSekolah,
        kelas: result.kelas,
        namaOrangTua: result.namaOrangTua,
        paketLomba: result.paketLomba,
        whatsappOrangTua: result.whatsappOrangTua,
        tanggalLahir: result.tanggalLahir ? String(result.tanggalLahir) : null,
        usia: result.usia,
      };
    }
  }

  return {
    id: pendaftaran.id,
    jenisLomba,
    orderId: String(pendaftaran.orderId),
    statusBayar: String(pendaftaran.statusBayar ?? "PENDING").toUpperCase(),
    paymentUrl: pendaftaran.paymentUrl ?? null,
    peserta: {
      namaLengkap: pendaftaran.peserta?.namaLengkap ?? "—",
      email: pendaftaran.peserta?.email ?? "—",
      noWhatsapp: pendaftaran.peserta?.noWhatsapp ?? "—",
    },
    detail,
    anggota,
  };
}
