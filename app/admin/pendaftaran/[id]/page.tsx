import Link from "next/link";
import { notFound } from "next/navigation";

import AdminHeader from "@/app/components/admin/AdminHeader";
import PaymentStatusBadge from "@/app/components/admin/PaymentStatusBadge";
import { getAdminRegistrationDetail } from "@/lib/admin/registration";

type PageProps = {
  params: Promise<{ id: string }>;
};

const lombaLabels: Record<string, string> = {
  FUN_RUN: "Fun Run 7K",
  LCC_SD: "LCC SD",
  CERDAS_CERMAT: "Cerdas Cermat",
  TALENT_SHOW: "Talent Show",
  STMS: "STMS",
  MEWARNAI: "Mewarnai",
};

function formatLabel(key: string) {
  const labels: Record<string, string> = {
    namaPerwakilan: "Nama Perwakilan",
    jenisKelamin: "Jenis Kelamin",
    kontakDarurat: "Kontak Darurat",
    jenisBakat: "Jenis Bakat",
    jumlahAnggota: "Jumlah Anggota",
    kelas: "Kelas",
    menggunakanMusik: "Menggunakan Musik",
    perlengkapan: "Perlengkapan",
    namaSekolah: "Nama Sekolah",
    alamatSekolah: "Alamat Sekolah",
    namaGuruPendamping: "Guru Pendamping",
    emailPendamping: "Email Pendamping",
    whatsappPendamping: "WhatsApp Pendamping",
    asalSekolah: "Asal Sekolah",
    namaOrangTua: "Nama Orang Tua",
    paketLomba: "Paket Lomba",
    whatsappOrangTua: "WhatsApp Orang Tua",
    emailOrangTua: "Email Orang Tua",
    usia: "Usia",
  };

  return labels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function formatValue(value: string | number | boolean | null) {
  if (value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  return String(value);
}

function InfoGrid({ data }: { data: Record<string, string | number | boolean | null> }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="rounded-xl bg-slate-50 p-4">
          <dt className="text-sm text-slate-500">{formatLabel(key)}</dt>
          <dd className="mt-1 wrap-break-words font-semibold text-slate-800">
            {formatValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default async function PendaftaranDetailPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getAdminRegistrationDetail(id);

  if (!data) notFound();

  return (
    <>
      <AdminHeader
        title="Detail Pendaftaran"
        description="Informasi pendaftar, data lomba, dan status transaksi."
      />

      <main className="space-y-6 p-5 sm:p-8">
        <Link href="/admin/pendaftaran" className="inline-flex text-sm font-semibold text-[#007FA3] hover:underline">
          ← Kembali ke semua pendaftaran
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <p className="text-sm text-slate-500">Pendaftar</p>
            <h2 className="mt-1 text-xl font-bold text-[#00354E]">{data.namaLengkap}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {lombaLabels[data.jenisLomba] ?? data.jenisLomba}
            </p>
          </div>
          <InfoGrid
            data={{
              Email: data.email,
              "Nomor WhatsApp": data.noWhatsapp,
            }}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-[#00354E]">Informasi Pembayaran</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Order ID</dt>
              <dd className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">{data.orderId}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="mb-2 text-sm text-slate-500">Status Pembayaran</dt>
              <dd><PaymentStatusBadge status={data.statusBayar} /></dd>
            </div>
          </dl>
          {data.paymentUrl && (
            <a href={data.paymentUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-[#00354E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00516F]">
              Buka Halaman Pembayaran ↗
            </a>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-[#00354E]">
            Detail {lombaLabels[data.jenisLomba] ?? data.jenisLomba}
          </h2>
          {data.detail ? (
            <InfoGrid data={data.detail} />
          ) : (
            <p className="text-sm text-slate-500">Belum ada data detail tambahan untuk jenis lomba ini.</p>
          )}
          {data.anggota.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-semibold text-slate-800">Anggota Tim</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Nama</th>
                      <th className="px-4 py-3">Kelas</th>
                      <th className="px-4 py-3">Jabatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.anggota.map((member, index) => (
                      <tr key={`${member.namaLengkap}-${index}`}>
                        <td className="px-4 py-3 font-medium text-slate-800">{member.namaLengkap}</td>
                        <td className="px-4 py-3 text-slate-600">{member.kelas ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{member.jabatan ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
