import type { ReactNode } from "react";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
