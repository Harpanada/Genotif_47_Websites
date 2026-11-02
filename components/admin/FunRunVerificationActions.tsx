"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  registrationId: string;
  status: string;
  note: string | null;
  studentCardPath: string | null;
  verifiedAt: string | null;
  paymentExpiresAt: string | null;
};

export default function FunRunVerificationActions({
  registrationId,
  status,
  note,
  studentCardPath,
  verifiedAt,
  paymentExpiresAt,
}: Props) {
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rejectionNote, setRejectionNote] = useState("");

  async function openStudentCard() {
    setError("");

    try {
      const response = await fetch(
        `/api/admin/registration/${encodeURIComponent(registrationId)}/verification`,
        { cache: "no-store" },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Gagal membuka kartu pelajar.");
      }

      window.open(result.data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  async function submitDecision(decision: "APPROVED" | "REJECTED") {
    if (decision === "REJECTED" && rejectionNote.trim().length < 5) {
      setError("Alasan penolakan minimal 5 karakter.");
      return;
    }

    const confirmed = window.confirm(
      decision === "APPROVED"
        ? "Setujui pendaftaran Fun Run Internal?"
        : "Tolak pendaftaran Fun Run Internal?",
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/registration/${encodeURIComponent(registrationId)}/verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            decision,
            note: decision === "REJECTED" ? rejectionNote.trim() : undefined,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Gagal memproses verifikasi.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  if (!studentCardPath) return null;

  return (
    <section className=" rounded-2xl border border-slate-200 bg-white p-6 ">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#00354E]">
            Verifikasi Peserta Internal
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Periksa kartu pelajar sebelum mengambil keputusan.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            status === "APPROVED"
              ? "bg-green-100 text-green-700"
              : status === "REJECTED"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
          }`}>
          {status}
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">Bukti kartu pelajar</p>

        <button
          type="button"
          onClick={openStudentCard}
          className="mt-2 font-semibold text-[#007FA3] hover:underline">
          Lihat kartu pelajar
        </button>
      </div>

      {verifiedAt && (
        <p className="mt-4 text-sm text-slate-500">
          Diproses:{" "}
          {new Date(verifiedAt).toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
            timeZone: "Asia/Jakarta",
          })}
        </p>
      )}

      {paymentExpiresAt && (
        <p className="mt-2 text-sm text-slate-500">
          Batas pembayaran:{" "}
          {new Date(paymentExpiresAt).toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
            timeZone: "Asia/Jakarta",
          })}
        </p>
      )}

      {note && (
        <div className="mt-4 rounded-xl bg-red-50 p-4">
          <p className="font-semibold text-red-800">Alasan penolakan</p>
          <p className="mt-1 text-sm text-red-700">{note}</p>
        </div>
      )}

      {status === "PENDING" && (
        <div className="mt-5 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Alasan penolakan (wajib jika menolak)
            <textarea
              value={rejectionNote}
              onChange={(event) => setRejectionNote(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Tuliskan alasan penolakan..."
              className="mt-2 w-full rounded-xl border border-slate-300 p-3"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => submitDecision("APPROVED")}
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? "Memproses..." : "Setujui"}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => submitDecision("REJECTED")}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {busy ? "Memproses..." : "Tolak"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
