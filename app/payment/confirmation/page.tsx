"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

type StatusResponse = {
  data?: {
    registrationId: string;
    statusBayar: PaymentStatus;
  };
  error?: string;
};

const statusContent: Record<
  PaymentStatus,
  { title: string; description: string; color: string }
> = {
  PENDING: {
    title: "Menunggu Pembayaran",
    description:
      "Kami sedang menunggu konfirmasi pembayaran dari penyedia pembayaran. Halaman ini akan diperbarui otomatis.",
    color: "text-amber-600",
  },
  PAID: {
    title: "Pembayaran Terverifikasi",
    description:
      "Pembayaranmu telah dikonfirmasi. Simpan informasi pendaftaranmu untuk referensi.",
    color: "text-green-600",
  },
  FAILED: {
    title: "Pembayaran Gagal",
    description:
      "Transaksi belum berhasil diselesaikan. Periksa status transaksi atau hubungi panitia jika kamu sudah melakukan pembayaran.",
    color: "text-red-600",
  },
  REFUNDED: {
    title: "Pembayaran Dikembalikan",
    description:
      "Status transaksi tercatat sebagai pengembalian dana. Hubungi panitia jika membutuhkan informasi lebih lanjut.",
    color: "text-slate-600",
  },
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setError("ID transaksi tidak ditemukan pada URL.");
      setChecking(false);
      return;
    }

    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    const checkStatus = async () => {
      controller = new AbortController();

      try {
        const response = await fetch(
          `/api/payment/status?order_id=${encodeURIComponent(orderId)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const result: StatusResponse = await response.json();

        if (!response.ok || !result.data) {
          throw new Error(result.error ?? "Status transaksi gagal diperiksa.");
        }

        if (!active) return;

        const nextStatus = result.data.statusBayar;

        if (!["PENDING", "PAID", "FAILED", "REFUNDED"].includes(nextStatus)) {
          throw new Error("Status pembayaran tidak dikenali.");
        }

        setStatus(nextStatus);
        setError("");
        setChecking(false);

        if (nextStatus === "PENDING") {
          timer = setTimeout(checkStatus, 4000);
        }
      } catch (err) {
        if (!active || (err instanceof Error && err.name === "AbortError")) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memeriksa pembayaran.",
        );
        setChecking(false);

        // Tetap coba lagi jika terjadi gangguan jaringan sementara.
        timer = setTimeout(checkStatus, 5000);
      }
    };

    void checkStatus();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      controller?.abort();
    };
  }, [orderId]);

  const currentStatus = status ? statusContent[status] : null;

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg sm:p-10">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#30B5D8]">
            GENOTIF
          </p>

          <h1 className="mt-3 text-2xl font-bold text-[#00354E] sm:text-3xl">
            Konfirmasi Pembayaran
          </h1>
        </div>

        {checking && !currentStatus && !error && (
          <p className="py-8 text-center text-slate-600">
            Memeriksa status transaksi...
          </p>
        )}

        {currentStatus && (
          <div className="text-center">
            <h2 className={`text-xl font-bold ${currentStatus.color}`}>
              {currentStatus.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {currentStatus.description}
            </p>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left">
              <p className="text-sm text-slate-500">ID Transaksi</p>
              <p className="mt-1 break-all font-mono text-sm text-[#00354E]">
                {orderId}
              </p>

              <p className="mt-4 text-sm text-slate-500">Status pembayaran</p>
              <p className="mt-1 font-semibold text-[#00354E]">{status}</p>
            </div>

            {status === "PENDING" && (
              <p className="mt-4 text-sm text-slate-500">
                Pemeriksaan otomatis dilakukan setiap 4 detik.
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-center text-red-700">
            <p className="font-semibold">Belum dapat memeriksa transaksi</p>
            <p className="mt-2 text-sm">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#00354E] px-5 py-2 font-semibold text-white hover:opacity-90">
              Coba Lagi
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-slate-500">
          Jika status belum berubah setelah pembayaran, tunggu beberapa saat
          atau hubungi panitia Genotif.
        </p>
      </section>
    </main>
  );
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center">
          Memuat konfirmasi pembayaran...
        </main>
      }>
      <ConfirmationContent />
    </Suspense>
  );
}
