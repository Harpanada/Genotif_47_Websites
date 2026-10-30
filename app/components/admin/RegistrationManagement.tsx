"use client";

import { useMemo, useState } from "react";
import { formatTanggal } from "@/lib/validations/format-date";

type Registration = {
  id: string;
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  jenisLomba: string;
  orderId: string;
  statusBayar: string;
  createdAt: string;
  checkedInAt: string | null;
};

type RegistrationManagementProps = {
  registrations: Registration[];
};

const lombaLabels: Record<string, string> = {
  FUN_RUN: "Fun Run 7K",
  LCC_SD: "LCC SD",
  CERDAS_CERMAT: "Cerdas Cermat",
  TALENT_SHOW: "Talent Show",
  STMS: "STMS",
  MEWARNAI: "Mewarnai",
};

function formatJenisLomba(jenis: string) {
  return lombaLabels[jenis] ?? jenis.replaceAll("_", " ");
}

function normalizeStatus(status: string) {
  return status.trim().toUpperCase();
}

function getStatusStyle(status: string) {
  switch (normalizeStatus(status)) {
    // Berhasil
    case "PAID":
    case "SETTLEMENT":
    case "CAPTURE":
      return "bg-green-100 text-green-700 ring-1 ring-green-200";

    // Menunggu pembayaran
    case "PENDING":
    case "AUTHORIZE":
      return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";

    // Gagal atau dibatalkan
    case "DENY":
    case "CANCEL":
    case "EXPIRE":
    case "FAILED":
    case "FAILURE":
      return "bg-red-100 text-red-700 ring-1 ring-red-200";

    // Pengembalian dana
    case "REFUND":
    case "REFUNDED":
    case "PARTIAL_REFUND":
      return "bg-purple-100 text-purple-700 ring-1 ring-purple-200";

    // Sengketa transaksi
    case "CHARGEBACK":
    case "PARTIAL_CHARGEBACK":
      return "bg-orange-100 text-orange-700 ring-1 ring-orange-200";

    // Status tidak dikenal
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

function getStatusLabel(status: string) {
  const normalized = normalizeStatus(status);

  const labels: Record<string, string> = {
    PAID: "Lunas",
    SETTLEMENT: "Lunas",
    CAPTURE: "Berhasil",
    PENDING: "Pending",
    AUTHORIZE: "Menunggu Capture",
    DENY: "Ditolak",
    CANCEL: "Dibatalkan",
    EXPIRE: "Kedaluwarsa",
    FAILURE: "Gagal",
    FAILED: "Gagal",
    REFUND: "Refund",
    REFUNDED: "Refund",
    PARTIAL_REFUND: "Refund Sebagian",
    CHARGEBACK: "Chargeback",
    PARTIAL_CHARGEBACK: "Chargeback Sebagian",
  };

  return labels[normalized] ?? normalized.replaceAll("_", " ");
}

export default function RegistrationManagement({
  registrations,
}: RegistrationManagementProps) {
  const [search, setSearch] = useState("");
  const [selectedLomba, setSelectedLomba] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const availableLomba = useMemo(
    () => [...new Set(registrations.map((item) => item.jenisLomba))].sort(),
    [registrations],
  );

  const availableStatus = useMemo(
    () => [...new Set(registrations.map((item) => item.statusBayar))].sort(),
    [registrations],
  );

  const filteredRegistrations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return registrations.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.namaLengkap.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.noWhatsapp.toLowerCase().includes(keyword) ||
        item.orderId.toLowerCase().includes(keyword);

      const matchesLomba =
        selectedLomba === "ALL" || item.jenisLomba === selectedLomba;

      const matchesStatus =
        selectedStatus === "ALL" || item.statusBayar === selectedStatus;

      return matchesSearch && matchesLomba && matchesStatus;
    });
  }, [registrations, search, selectedLomba, selectedStatus]);

  function resetFilters() {
    setSearch("");
    setSelectedLomba("ALL");
    setSelectedStatus("ALL");
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Search dan filter */}
      <div className="grid gap-3 border-b border-slate-200 p-5 lg:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama, email, WhatsApp, order ID..."
          aria-label="Cari pendaftaran"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#30B5D8] focus:ring-2 focus:ring-[#30B5D8]/20"
        />

        <select
          value={selectedLomba}
          onChange={(event) => setSelectedLomba(event.target.value)}
          aria-label="Filter jenis lomba"
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#30B5D8]">
          <option value="ALL">Semua jenis lomba</option>

          {availableLomba.map((jenis) => (
            <option key={jenis} value={jenis}>
              {formatJenisLomba(jenis)}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
          aria-label="Filter status pembayaran"
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#30B5D8]">
          <option value="ALL">Semua status pembayaran</option>

          {availableStatus.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      {/* Jumlah data dan reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="text-sm text-slate-500">
          Menampilkan{" "}
          <span className="font-semibold text-slate-800">
            {filteredRegistrations.length}
          </span>{" "}
          dari {registrations.length} pendaftaran
        </p>

        <button
          type="button"
          onClick={resetFilters}
          className="text-sm font-semibold text-[#007FA3] hover:underline">
          Reset filter
        </button>
      </div>

      {/* Tabel */}
      {filteredRegistrations.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <p className="font-semibold text-slate-700">
            Tidak ada pendaftaran yang cocok
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Coba ubah kata kunci atau reset filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Nama Peserta</th>
                <th className="px-5 py-4">Jenis Lomba</th>
                <th className="px-5 py-4">WhatsApp</th>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Reg ID</th>
                <th className="px-5 py-4">Waktu Pendaftaran</th>
                <th className="px-5 py-4">Status Pembayaran</th>
                <th className="px-5 py-4">Status Check-in</th>
                <th className="px-5 py-4">Waktu Check-in</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {item.namaLengkap}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.email}</p>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {formatJenisLomba(item.jenisLomba)}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.noWhatsapp}
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-slate-500">
                    {item.orderId}
                  </td>

                  <td className="px-5 py-4 font-mono text-xs text-slate-500">
                    {item.id}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">
                    {formatTanggal(item.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(item.statusBayar)}`}>
                      {getStatusLabel(item.statusBayar)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {item.checkedInAt ? (
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Sudah Check-in
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Belum Check-in
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-600">
                    {item.checkedInAt ? formatTanggal(item.checkedInAt) : "—"}
                  </td>

                  <td className="px-5 py-4">
                    <a
                      href={`/admin/pendaftaran/${item.id}`}
                      className="whitespace-nowrap font-semibold text-[#007FA3] hover:underline">
                      Lihat detail →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
