"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ScannerUser = {
  username: string;
  nama: string;
  role: "ADMIN" | "SCANNER";
};

type ScanResult = {
  success: boolean;
  status: "CHECKED_IN" | "ALREADY_CHECKED_IN" | "UNPAID" | "INVALID" | "ERROR";
  message: string;
  participant?: {
    nama: string;
    jenisLomba: string;
    orderId: string;
    checkedInAt?: string | null;
    checkedInBy?: string | null;
  };
};

export default function ScannerPage() {
  const router = useRouter();

  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const processingRef = useRef(false);

  const [user, setUser] = useState<ScannerUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState("");

  // Validasi sesi panitia
  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/scanner/session", {
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/scanner/login");
          return;
        }

        const data = await response.json();

        if (active) {
          setUser(data.user);
        }
      } catch {
        router.replace("/scanner/login");
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  const stopCamera = useCallback(async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      setCameraActive(false);
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
      scanner.clear();
    } catch (error) {
      console.error("Gagal menghentikan kamera:", error);
    } finally {
      scannerRef.current = null;
      setCameraActive(false);
    }
  }, []);

  // Bersihkan kamera ketika halaman ditinggalkan
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner?.isScanning) {
        void scanner.stop().catch(console.error);
      }
    };
  }, []);

  async function handleScan(decodedText: string) {
    if (processingRef.current || loading) return;

    processingRef.current = true;
    setLoading(true);
    setResult(null);

    // Hentikan kamera sementara agar QR tidak diproses berulang.
    await stopCamera();

    try {
      const response = await fetch("/api/scanner/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: decodedText }),
      });

      const data = (await response.json()) as ScanResult;

      if (response.status === 401) {
        router.replace("/scanner/login");
        return;
      }

      setResult(data);
    } catch {
      setResult({
        success: false,
        status: "ERROR",
        message: "Tidak dapat menghubungi server. Periksa koneksi internet.",
      });
    } finally {
      setLoading(false);
      processingRef.current = false;
    }
  }

  async function startCamera() {
    if (scannerRef.current || cameraActive) return;

    setCameraError("");
    setResult(null);

    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } =
        await import("html5-qrcode");

      const scanner = new Html5Qrcode("genotif-qr-reader", {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });

      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1,
        },
        (decodedText) => {
          void handleScan(decodedText);
        },
        () => {
          // Error pembacaan frame biasa diabaikan.
        },
      );

      setCameraActive(true);
    } catch (error) {
      console.error("Camera error:", error);
      scannerRef.current = null;
      setCameraActive(false);
      setCameraError(
        "Kamera tidak dapat diakses. Pastikan izin kamera diberikan dan halaman menggunakan HTTPS.",
      );
    }
  }

  async function handleLogout() {
    try {
      await stopCamera();
      await fetch("/api/scanner/logout", { method: "POST" });
    } finally {
      router.replace("/scanner/login");
      router.refresh();
    }
  }

  if (checkingSession || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#002D40] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#30B5D8]" />
          <p className="text-sm text-white/60">Memeriksa sesi panitia...</p>
        </div>
      </main>
    );
  }

  const statusStyles: Record<ScanResult["status"], string> = {
    CHECKED_IN: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    ALREADY_CHECKED_IN: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    UNPAID: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    INVALID: "border-red-400/30 bg-red-400/10 text-red-300",
    ERROR: "border-red-400/30 bg-red-400/10 text-red-300",
  };

  const statusLabels: Record<ScanResult["status"], string> = {
    CHECKED_IN: "CHECK-IN BERHASIL",
    ALREADY_CHECKED_IN: "TIKET SUDAH DIGUNAKAN",
    UNPAID: "PEMBAYARAN BELUM SELESAI",
    INVALID: "TIKET TIDAK VALID",
    ERROR: "TERJADI KESALAHAN",
  };

  return (
    <main className="min-h-screen bg-[#F3F7F9] text-[#002D40]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#002D40] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#30B5D8]">
              Genotif 47
            </p>
            <h1 className="mt-1 text-lg font-extrabold">Ticket Scanner</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.nama}</p>
              <p className="text-xs text-white/50">{user.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
        {/* Welcome */}
        <section className="mb-7">
          <p className="text-sm font-medium text-[#1688A8]">PANEL PANITIA</p>
          <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            Verifikasi Peserta
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Arahkan QR tiket peserta ke kamera untuk melakukan check-in.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Scanner */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-bold">QR Code Scanner</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Gunakan kamera belakang perangkat.
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                  cameraActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}>
                {cameraActive ? "KAMERA AKTIF" : "KAMERA NONAKTIF"}
              </span>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative overflow-hidden rounded-2xl bg-[#001F30]">
                <div
                  id="genotif-qr-reader"
                  className="min-h-75 w-full overflow-hidden"
                />

                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#30B5D8]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="h-9 w-9">
                        <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" />
                        <path d="M14 14h3v3h-3zM19 14h2v2h-2zM19 19h2v2h-2z" />
                      </svg>
                    </div>
                    <p className="font-semibold text-white">
                      Kamera belum diaktifkan
                    </p>
                    <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/50">
                      Tekan tombol di bawah untuk memulai pemindaian tiket.
                    </p>
                  </div>
                )}
              </div>

              {cameraError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600">
                  {cameraError}
                </p>
              )}

              <div className="mt-5 flex gap-3">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    disabled={loading}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#30B5D8] text-sm font-bold text-[#002D40] transition hover:bg-[#56C8E5] disabled:opacity-50">
                    <span>Aktifkan Kamera</span>
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="h-12 flex-1 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
                    Hentikan Kamera
                  </button>
                )}
              </div>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
                Pastikan QR Code terlihat jelas dan berada di dalam area kamera.
              </p>
            </div>
          </section>

          {/* Result */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="font-bold">Hasil Pemindaian</h3>
              <p className="mt-1 text-xs text-slate-400">
                Informasi tiket akan muncul di sini.
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#30B5D8]" />
                <p className="text-sm font-semibold">Memverifikasi tiket...</p>
                <p className="mt-1 text-xs text-slate-400">
                  Mohon tunggu sebentar.
                </p>
              </div>
            ) : result ? (
              <div className="space-y-5">
                <div
                  className={`rounded-2xl border p-4 ${statusStyles[result.status]}`}>
                  <p className="text-xs font-extrabold tracking-wide">
                    {statusLabels[result.status]}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    {result.message}
                  </p>
                </div>

                {result.participant && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Nama Peserta
                      </p>
                      <p className="mt-1 text-lg font-extrabold">
                        {result.participant.nama}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Jenis Lomba
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {result.participant.jenisLomba}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Order ID
                      </p>
                      <p className="mt-1 break-all font-mono text-xs text-slate-500">
                        {result.participant.orderId}
                      </p>
                    </div>

                    {result.participant.checkedInAt && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Waktu Check-in
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {new Date(
                            result.participant.checkedInAt,
                          ).toLocaleString("id-ID")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setResult(null)}
                  className="h-11 w-full rounded-xl bg-[#002D40] text-sm font-bold text-white transition hover:bg-[#06465E]">
                  Scan Tiket Berikutnya
                </button>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-6 w-6">
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" />
                    <path d="M14 14h3v3h-3z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Belum ada tiket dipindai
                </p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-400">
                  Hasil verifikasi dan informasi peserta akan ditampilkan
                  setelah QR berhasil dibaca.
                </p>
              </div>
            )}
          </section>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Genotif 47 · Committee Scanner
        </footer>
      </div>
    </main>
  );
}
