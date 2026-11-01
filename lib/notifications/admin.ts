import "server-only";

import { Resend } from "resend";

type FunRunInternalNotificationInput = {
  registrationId: string;
  namaLengkap: string;
  email: string;
  noWhatsapp: string;
  kelas: string;
  createdAt: string | Date;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

export async function sendAdminFunRunInternalNotification(
  input: FunRunInternalNotificationInput,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const appUrl = process.env.GENOTIF_APP_URL;

  if (!apiKey || !from || !adminEmail || !appUrl) {
    throw new Error("Konfigurasi Admin Notifier belum lengkap.");
  }

  const resend = new Resend(apiKey);

  const registrationUrl = new URL(
    `/admin/pendaftaran/${encodeURIComponent(input.registrationId)}`,
    appUrl,
  ).toString();

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(input.createdAt));

  const nama = escapeHtml(input.namaLengkap);
  const email = escapeHtml(input.email);
  const whatsapp = escapeHtml(input.noWhatsapp);
  const kelas = escapeHtml(input.kelas);
  const id = escapeHtml(input.registrationId);

  const { data, error } = await resend.emails.send(
    {
      from,
      to: [adminEmail],
      subject: `[GENOTIF] Verifikasi Fun Run Internal - ${input.namaLengkap}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1e293b">
          <div style="background:#00354E;padding:24px;border-radius:12px 12px 0 0">
            <h1 style="color:#ffffff;font-size:22px;margin:0">
              Genotif 47
            </h1>
            <p style="color:#bae6fd;margin:8px 0 0">
              Admin Notification
            </p>
          </div>

          <div style="padding:24px;border:1px solid #e2e8f0;border-top:0">
            <p style="font-size:16px">
              Ada pendaftaran Fun Run Internal baru yang membutuhkan verifikasi.
            </p>

            <div style="background:#fff7ed;padding:14px;border-radius:8px;margin:20px 0">
              <strong style="color:#9a3412">Status: MENUNGGU VERIFIKASI</strong>
            </div>

            <h2 style="font-size:17px">Informasi Peserta</h2>

            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0">ID Pendaftaran</td>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0"><strong>${id}</strong></td>
              </tr>
              <tr>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0">Nama</td>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0"><strong>${nama}</strong></td>
              </tr>
              <tr>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0">Kelas</td>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0">${kelas}</td>
              </tr>
              <tr>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0">Email</td>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0">${email}</td>
              </tr>
              <tr>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0">WhatsApp</td>
                <td style="padding:9px;border-bottom:1px solid #e2e8f0">${whatsapp}</td>
              </tr>
              <tr>
                <td style="padding:9px">Waktu Pendaftaran</td>
                <td style="padding:9px">${tanggal}</td>
              </tr>
            </table>

            <div style="margin:28px 0">
              <a
                href="${registrationUrl}"
                style="background:#007FA3;color:#ffffff;padding:13px 20px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block"
              >
                Buka Detail Pendaftaran
              </a>
            </div>

            <p style="font-size:13px;color:#64748b">
              Silakan periksa kartu pelajar peserta melalui Admin Dashboard
              sebelum memberikan keputusan.
            </p>
          </div>

          <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:18px">
            Email otomatis dari sistem Genotif 47. Mohon tidak membalas email ini.
          </p>
        </div>
      `,
    },
    {
      idempotencyKey: `admin-fun-run-internal-${input.registrationId}`,
    },
  );

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("Resend tidak mengembalikan ID email.");
  }

  return {
    success: true,
    emailId: data.id,
  };
}
