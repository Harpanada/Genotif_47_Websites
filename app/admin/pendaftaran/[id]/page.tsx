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
  CERDAS_CERMAT: "Cerdas Cermat",
  STMS: "Talent Show (STMS)",
  MEWARNAI: "Mewarnai",
};

function formatLabel(key: string) {
  const labels: Record<string, string> = {
    jenisKelamin: "Jenis Kelamin",
    kontakDarurat: "Kontak Darurat",
    kelas: "Kelas",
    jenisBakat: "Jenis Bakat",
    jumlahAnggota: "Jumlah Anggota",
    menggunakanMusik: "Menggunakan Musik",
    perlengkapan: "Perlengkapan",
    namaSekolah: "Nama Sekolah",
    alamatSekolah: "Alamat Sekolah",
    namaGuruPendamping: "Guru Pendamping",
    asalSekolah: "Asal Sekolah",
    namaOrangTua: "Nama Orang Tua",
    paketLomba: "Paket Lomba",
    usia: "Usia",
  };

  return (
    labels[key] ??
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
  );
}

function formatValue(value: string | number | boolean | null) {
  if (value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  return String(value);
}

function InfoGrid({
  data,
}: {
  data: Record<string, string | number | boolean | null>;
}) {
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

  if (!data) {
    notFound();
  }

  const labelLomba = lombaLabels[data.jenisLomba] ?? data.jenisLomba;

  return (
    <>
      <AdminHeader
        title="Detail Pendaftaran"
        description="Informasi peserta, data lomba, dan status transaksi."
      />

      <main className="space-y-6 p-5 sm:p-8">
        <Link
          href="/admin/pendaftaran"
          className="inline-flex text-sm font-semibold text-[#007FA3] hover:underline">
          ← Kembali ke semua pendaftaran
        </Link>

        {/* Data pendaftar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <p className="text-sm text-slate-500">Pendaftar</p>
            <h2 className="mt-1 text-xl font-bold text-[#00354E]">
              {data.peserta.namaLengkap}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{labelLomba}</p>
            <p className="mt-2 break-all font-mono text-xs text-slate-400">
              ID Registrasi: {data.id}
            </p>
          </div>

          <InfoGrid
            data={{
              Email: data.peserta.email,
              NomorWhatsApp: data.peserta.noWhatsapp,
            }}
          />
        </section>

        {/* Informasi pembayaran */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-[#00354E]">
            Informasi Pembayaran
          </h2>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-sm text-slate-500">Order ID</dt>
              <dd className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">
                {data.orderId}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="mb-2 text-sm text-slate-500">Status Pembayaran</dt>
              <dd>
                <PaymentStatusBadge status={data.statusBayar} />
              </dd>
            </div>
          </dl>
          {/* 
          {data.paymentUrl && (
            <a
              href={data.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl bg-[#00354E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00516F]">
              Buka Halaman Pembayaran ↗
            </a>
          )} */}
        </section>

        {/* Detail sesuai jenis lomba */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 text-lg font-bold text-[#00354E]">
            Detail {labelLomba}
          </h2>

          {data.detail && Object.keys(data.detail).length > 0 ? (
            <InfoGrid data={data.detail} />
          ) : (
            <p className="text-sm text-slate-500">
              Belum ada data detail tambahan untuk jenis lomba ini.
            </p>
          )}

          {data.anggota.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-semibold text-slate-800">Anggota Tim</h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-120 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">ID Anggota</th>
                      <th className="px-4 py-3">Nama</th>
                      <th className="px-4 py-3">Kelas</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {data.anggota.map((member) => (
                      <tr key={member.id}>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                          {member.id}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {member.namaLengkap}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {member.kelas ?? "—"}
                        </td>
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
