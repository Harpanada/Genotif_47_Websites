import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { verifyAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticated = await verifyAdminSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
