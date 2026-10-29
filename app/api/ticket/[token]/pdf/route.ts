import { chromium } from "playwright";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { token } = await params;

  if (!/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json(
      { error: "Token tiket tidak valid." },
      { status: 400 },
    );
  }

  const baseUrl = process.env.TICKET_PUBLIC_BASE_URL;

  if (!baseUrl) {
    console.error("TICKET_PUBLIC_BASE_URL belum dikonfigurasi.");

    return NextResponse.json(
      { error: "Konfigurasi server belum lengkap." },
      { status: 500 },
    );
  }

  let browser;

  try {
    browser = await chromium.launch({ headless: true });

    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });

    const ticketUrl = new URL(
      `/ticket/${encodeURIComponent(token)}`,
      baseUrl,
    ).toString();

    const response = await page.goto(ticketUrl, {
      waitUntil: "networkidle",
      timeout: 20000,
    });

    if (!response?.ok()) {
      console.error("Gagal membuka halaman tiket untuk PDF.", {
        status: response?.status(),
      });

      return NextResponse.json(
        { error: "Halaman tiket gagal dimuat." },
        { status: 502 },
      );
    }

    // Tunggu font dan gambar siap sebelum merender PDF.
    await page.evaluate(async () => {
      await document.fonts.ready;

      await Promise.all(
        Array.from(document.images).map((image) => {
          if (image.complete) return Promise.resolve();

          return new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), {
              once: true,
            });
            image.addEventListener("error", () => resolve(), {
              once: true,
            });
          });
        }),
      );
    });

    // Hilangkan header halaman dan teks petunjuk di luar kartu tiket.
    await page.addStyleTag({
      content: `
  @page {
    size: 280mm 140mm;
    margin: 0;
  }

  html,
  body {
    width: 280mm !important;
    height: 140mm !important;
    min-height: 140mm !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: #eef4f7 !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }

  body > * {
    margin: 0 !important;
  }

  main {
    width: 280mm !important;
    height: 140mm !important;
    min-height: 0 !important;
    max-height: 140mm !important;
    padding: 5mm !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
  }

  /* Hilangkan judul dan keterangan di luar tiket */
  main > div > header,
  main > div > p {
    display: none !important;
  }

  /* Paksa tiket muat di area cetak */
  article {
    width: 270mm !important;
    max-width: 270mm !important;
    height: 130mm !important;
    max-height: 130mm !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
    box-shadow: none !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  article section {
    min-height: 0 !important;
    padding: 5mm !important;
    box-sizing: border-box !important;
  }

  article h2 {
    font-size: 20pt !important;
    line-height: 1.15 !important;
  }

  article h3 {
    font-size: 21pt !important;
    line-height: 1.15 !important;
  }

  article aside img {
    width: 38mm !important;
    height: 38mm !important;
    max-width: 38mm !important;
    max-height: 38mm !important;
  }

  /* Sembunyikan semua tombol, termasuk tombol Unduh */
  button,
  [role="button"],
  a[href*="/pdf"] {
    display: none !important;
  }

  *,
  *::before,
  *::after {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
`,
    });

    await page.emulateMedia({ media: "screen" });

    const pdf = await page.pdf({
      width: "280mm",
      height: "140mm",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
      scale: 0.95,
      pageRanges: "1",
    });

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="tiket-genotif.pdf"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Ticket PDF generation error:", error);

    return NextResponse.json(
      { error: "PDF tiket gagal dibuat." },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
