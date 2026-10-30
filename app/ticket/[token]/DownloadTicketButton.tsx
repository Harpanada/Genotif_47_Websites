"use client";

import { useState } from "react";
import { toBlob } from "html-to-image";

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
      const ticket = document.getElementById("download-ticket-card");

      if (!ticket) {
        throw new Error("Elemen tiket tidak ditemukan.");
      }

      // Tunggu font dan gambar selesai dimuat.
      await document.fonts.ready;

      const images = Array.from(ticket.querySelectorAll("img"));

      await Promise.all(
        images.map(async (img) => {
          if (!img.complete) {
            await new Promise<void>((resolve, reject) => {
              img.addEventListener("load", () => resolve(), {
                once: true,
              });
              img.addEventListener(
                "error",
                () => reject(new Error("Gambar tiket gagal dimuat.")),
                { once: true },
              );
            });
          }

          if (img.naturalWidth === 0) {
            throw new Error("Ada gambar tiket yang tidak tersedia.");
          }

          if (typeof img.decode === "function") {
            await img.decode();
          }
        }),
      );
      const blob = await toBlob(ticket, {
        width: 1200,
        height: 600,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      if (!blob) {
        throw new Error("Gagal membuat gambar tiket.");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `tiket-genotif-${token.slice(0, 8)}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tiket gagal diunduh.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        aria-busy={loading}
        className="inline-flex min-w-[200px] items-center justify-center gap-3 rounded-lg bg-[#00354E] px-6 py-3 font-bold text-white transition hover:bg-[#004b6b] disabled:cursor-not-allowed disabled:opacity-70">
        {loading && (
          <svg
            className="h-5 w-5 shrink-0 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        <span>{loading ? "Membuat gambar..." : "Unduh Tiket PNG"}</span>
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
