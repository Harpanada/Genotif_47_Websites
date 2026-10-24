import { db } from "@/src/prisma/db";

type Member = { namaLengkap: string; kelas?: string; jabatan?: string };

export async function getAdminDashboardData() {
  const pendaftaran = await db.orm.public.DataLomba.where({}).all();
  const statuses = pendaftaran.map(item => String(item.statusBayar ?? "UNKNOWN").toUpperCase());
  return {
    totalPeserta: pendaftaran.length,
    totalPendaftaran: pendaftaran.length,
    totalPending: statuses.filter(status => status === "PENDING").length,
    totalPaid: statuses.filter(status => status === "SETTLEMENT" || status === "CAPTURE").length,
    jenisLombaAktif: new Set(pendaftaran.map(item => item.jenisLomba)).size,
    pendaftaran: pendaftaran.slice(0, 8),
  };
}

export async function getAdminRegistrations() {
  const pendaftaran = await db.orm.public.DataLomba.where({}).all();
  return Promise.all(pendaftaran.map(async item => {
    const jenisLomba = String(item.jenisLomba);
    let namaLengkap = "—", email = "—", noWhatsapp = "—";
    if (jenisLomba === "FUN_RUN") {
      const d = await db.orm.public.DetailFunRun.where({dataLombaId:item.id}).first();
      if (d) { namaLengkap = d.namaLengkap; email = d.email; noWhatsapp = d.noWhatsapp; }
    } else if (jenisLomba === "STMS") {
      const d = await db.orm.public.DetailSTMS.where({dataLombaId:item.id}).first();
      if (d) namaLengkap = d.namaPerwakilan;
    } else if (jenisLomba === "CERDAS_CERMAT") {
      const d = await db.orm.public.DetailCerdasCermat.where({dataLombaId:item.id}).first();
      if (d) { namaLengkap = d.namaSekolah; email = d.emailPendamping; noWhatsapp = d.whatsappPendamping; }
    } else if (jenisLomba === "MEWARNAI") {
      const d = await db.orm.public.DetailMewarnai.where({dataLombaId:item.id}).first();
      if (d) { namaLengkap = d.namaPeserta; email = d.emailOrangTua; noWhatsapp = d.whatsappOrangTua; }
    }
    return { id:item.id, namaLengkap, email, noWhatsapp, jenisLomba, orderId:String(item.orderId), statusBayar:String(item.statusBayar ?? "PENDING").toUpperCase() };
  }));
}

export async function getAdminRegistrationDetail(id: string) {
  const pendaftaran = await db.orm.public.DataLomba.where({id}).first();
  if (!pendaftaran) return null;
  const jenisLomba = String(pendaftaran.jenisLomba);
  let detail: Record<string, string | number | boolean | null> | null = null;
  let anggota: Member[] = [];

  if (jenisLomba === "FUN_RUN") {
    const d = await db.orm.public.DetailFunRun.where({dataLombaId: id}).first();
    if (d) detail = { namaLengkap:d.namaLengkap, jenisKelamin:d.jenisKelamin, kontakDarurat:d.kontakDarurat, email:d.email, noWhatsapp:d.noWhatsapp };
  } else if (jenisLomba === "STMS") {
    const d = await db.orm.public.DetailSTMS.where({dataLombaId:id}).first();
    if (d) {
      detail = { namaPerwakilan:d.namaPerwakilan, kelas:d.kelas, jenisBakat:d.jenisBakat, jumlahAnggota:d.jumlahAnggota, menggunakanMusik:d.menggunakanMusik, perlengkapan:d.perlengkapan };
      anggota = (await db.orm.public.AnggotaSTMS.where({detailSTMSId:d.id}).all()).map(m=>({namaLengkap:m.namaLengkap}));
    }
  } else if (jenisLomba === "CERDAS_CERMAT") {
    const d = await db.orm.public.DetailCerdasCermat.where({dataLombaId:id}).first();
    if (d) {
      detail = { namaSekolah:d.namaSekolah, alamatSekolah:d.alamatSekolah, namaGuruPendamping:d.namaGuruPendamping, emailPendamping:d.emailPendamping, whatsappPendamping:d.whatsappPendamping };
      anggota = (await db.orm.public.AnggotaCerdasCermat.where({detailCerdasCermatId:d.id}).all()).map(m=>({namaLengkap:m.namaLengkap,kelas:m.kelas}));
    }
  } else if (jenisLomba === "MEWARNAI") {
    const d = await db.orm.public.DetailMewarnai.where({dataLombaId:id}).first();
    if (d) detail = { namaPeserta:d.namaPeserta, asalSekolah:d.asalSekolah, kelas:d.kelas, usia:d.usia, namaOrangTua:d.namaOrangTua, whatsappOrangTua:d.whatsappOrangTua, emailOrangTua:d.emailOrangTua, paketLomba:d.paketLomba };
  }

  return { id:pendaftaran.id, jenisLomba, orderId:String(pendaftaran.orderId), statusBayar:String(pendaftaran.statusBayar ?? "PENDING").toUpperCase(), paymentUrl:pendaftaran.paymentUrl ?? null, detail, anggota };
}
