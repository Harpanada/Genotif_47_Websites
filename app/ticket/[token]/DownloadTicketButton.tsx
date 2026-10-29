"use client";

import { useState } from "react";

type DownloadTicketButtonProps = {
  token: string;
};

export default function DownloadTicketButton({
  token,
}: DownloadTicketButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/ticket/${encodeURIComponent(token)}/pdf`,
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.error ?? "PDF tiket gagal diunduh.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = "tiket-genotif.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengunduh tiket.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00354E] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#07516d] disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? (
          <>
            <span className="animate-spin">↻</span>
            Membuat PDF...
          </>
        ) : (
          <>
            <span aria-hidden="true">↓</span>
            Unduh Tiket PDF
          </>
        )}
      </button>

      {error && (
        <p role="alert" className="max-w-sm text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
