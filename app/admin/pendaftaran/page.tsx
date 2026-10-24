import AdminHeader from "@/app/components/admin/AdminHeader";
import RegistrationManagement from "@/app/components/admin/RegistrationManagement";
import { getAdminRegistrations } from "@/lib/admin/registration";
import AdminAutoRefresh from "@/app/components/admin/AdminAutoRefresh";
import AdminNavbar from "@/app/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function PendaftaranPage() {
  const registrations = await getAdminRegistrations();

  return (
    <>
      <main className="scroll-smooth min-w-screen  min-h-screen bg-[#e4f3f6]">
        <AdminAutoRefresh />
        <AdminNavbar />
        <AdminHeader
          title="Manajemen Pendaftaran"
          description="Kelola dan pantau seluruh pendaftaran lomba Genotif."
        />

        <main className="space-y-6 p-5 sm:p-8">
          <section>
            <h2 className="text-lg font-bold text-[#00354E]">
              Semua Pendaftaran
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Cari peserta, filter jenis lomba, dan pantau status pembayaran.
            </p>
          </section>

          <RegistrationManagement registrations={registrations} />
        </main>
      </main>
    </>
  );
}
