"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "▦",
  },
  {
    label: "Pendaftaran",
    href: "/admin/pendaftaran",
    icon: "♙",
  },
  {
    label: "Pembayaran",
    href: "/admin/pembayaran",
    icon: "▤",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-[#00354E] text-white">
      <div className="border-b border-white/10 px-6 py-7">
        <p className="text-xl font-bold tracking-wide">GENOTIF</p>
        <p className="mt-1 text-xs text-white/60">Administration Panel</p>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">
          Menu Utama
        </p>

        {navigation.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#30B5D8] text-[#00354E]"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}>
              <span className="w-5 text-center text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-5">
        <p className="text-xs text-white/50">Genotif · Admin</p>
        <p className="mt-1 text-xs text-white/40">SMA Negeri 1 Ciranjang</p>
      </div>
    </aside>
  );
}
