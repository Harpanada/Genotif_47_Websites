import AdminHeader from "@/app/components/admin/AdminHeader";
import StatCard from "@/app/components/admin/StatCard";
import PaymentStatusBadge from "@/app/components/admin/PaymentStatusBadge";
import { getAdminDashboardData } from "@/lib/admin/registration";
import AdminAutoRefresh from "@/app/components/admin/AdminAutoRefresh";
import AdminNavbar from "@/app/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

function formatJenisLomba(jenis: string) {
  const labels: Record<string, string> = {
    FUN_RUN: "Fun Run 7K",
    LCC_SD: "LCC SD",
    CERDAS_CERMAT: "Cerdas Cermat",
    TALENT_SHOW: "Talent Show",
    STMS: "STMS",
    MEWARNAI: "Mewarnai",
  };

  return labels[jenis] ?? jenis.replaceAll("_", " ");
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  const stats = [
    {
      title: "Total Peserta",
      value: data.totalPeserta,
      description: "Jumlah data pada tabel Peserta",
      accent: "#30B5D8",
    },
    {
      title: "Total Pendaftaran",
      value: data.totalPendaftaran,
      description: "Jumlah pendaftaran lomba",
      accent: "#00354E",
    },
    {
      title: "Menunggu Pembayaran",
      value: data.totalPending,
      description: "Status PENDING",
      accent: "#F0AC2D",
    },
    {
      title: "Pembayaran Berhasil",
      value: data.totalPaid,
      description: "Status SETTLEMENT atau CAPTURE",
      accent: "#16A34A",
    },
  ];

  return (
    <>
      <main className="scroll-smooth min-w-screen  min-h-screen bg-[#e4f3f6]">
        <AdminAutoRefresh />
        <AdminNavbar />
        <AdminHeader
          title="Dashboard | Administrator Page"
          description="Ringkasan pendaftaran Genotif."
        />

        <div className="space-y-8 p-5 sm:p-8">
          <section>
            <h2 className="mb-5 text-lg font-bold text-[#00354E]">Ringkasan</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-lg font-bold text-[#00354E]">
                Pendaftaran Terbaru
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Data yang dibaca langsung dari database.
              </p>
            </div>

            {data.pendaftaran.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">
                Belum ada data pendaftaran.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-170 text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Nama Peserta</th>
                      <th className="px-6 py-4">Jenis Lomba</th>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Status Pembayaran</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {data.pendaftaran.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">
                            {item.peserta?.namaLengkap ?? "—"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.peserta?.email ?? "—"}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {formatJenisLomba(item.jenisLomba)}
                        </td>

                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {item.orderId}
                        </td>

                        <td className="px-6 py-4">
                          <PaymentStatusBadge status={item.statusBayar} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-slate-200 p-4 text-right">
              <a
                href="/admin/pendaftaran"
                className="text-sm font-semibold text-[#007FA3] hover:underline">
                Lihat semua pendaftaran →
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
