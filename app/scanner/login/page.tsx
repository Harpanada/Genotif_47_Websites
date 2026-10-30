"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ScannerLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/scanner/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal.");
      }

      router.replace("/scanner");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#002D40] px-5 py-12 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#30B5D8]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#F0AC2D]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-xl backdrop-blur">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-[#30B5D8]"
              stroke="currentColor"
              strokeWidth="1.8">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" />
              <path d="M14 14h3v3h-3zM19 14h2v2h-2zM19 19h2v2h-2zM14 19h2v2h-2z" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#30B5D8]">
            Genotif 47
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight">
            Committee Scanner
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Sistem verifikasi tiket dan check-in peserta.
          </p>
        </div>

        {/* Login Card */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold">Selamat datang!</h2>
            <p className="mt-1 text-sm text-white/50">
              Masuk menggunakan akun panitia.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-white/80">
                Username
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21a7 7 0 0 1 14 0" />
                </svg>

                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  disabled={loading}
                  required
                  maxLength={50}
                  className="h-13 w-full rounded-xl border border-white/10 bg-[#001F30]/70 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#30B5D8] focus:ring-2 focus:ring-[#30B5D8]/15 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-white/80">
                Password
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                </svg>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  required
                  className="h-13 w-full rounded-xl border border-white/10 bg-[#001F30]/70 pl-12 pr-14 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#30B5D8] focus:ring-2 focus:ring-[#30B5D8]/15 disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#30B5D8] hover:text-white disabled:opacity-50">
                  {showPassword ? "Sembunyi" : "Lihat"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#30B5D8] px-4 text-sm font-bold text-[#002D40] shadow-lg shadow-[#30B5D8]/15 transition hover:bg-[#56C8E5] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#002D40]/30 border-t-[#002D40]" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk ke Scanner"
              )}
            </button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-5 text-center">
            <p className="text-xs leading-relaxed text-white/40">
              Akses terbatas untuk panitia resmi Genotif.
              <br />
              Hubungi administrator jika mengalami kendala login.
            </p>
          </div>
        </section>

        <p className="mt-7 text-center text-xs text-white/30">
          © 2026 Genotif · Committee Access
        </p>
      </div>
    </main>
  );
}
