import "server-only";

import { scannerPool } from "@/lib/scanner/db";

export type ScanStatus =
  "CHECKED_IN" | "ALREADY_CHECKED_IN" | "UNPAID" | "INVALID";

export type ScanResult = {
  status: ScanStatus;
  message: string;
  participant?: {
    id: string;
    orderId: string;
    jenisLomba: string;
    nama: string;
    kategori: string;
    kontak: string;
    details: string[];
    members: string[];
    checkedInAt: string | null;
    checkedInBy: string | null;
  };
};

type TicketRow = {
  id: string;
  orderId: string;
  jenisLomba: string;
  statusBayar: string;
  checkedInAt: Date | string | null;
  checkedInBy: string | null;
  namaPanitia: string | null;
};

async function getTicket(token: string): Promise<TicketRow | null> {
  const result = await scannerPool.query<TicketRow>(
    `
      SELECT
        dl.id,
        dl."orderId",
        dl."jenisLomba",
        dl."statusBayar",
        dl."checkedInAt",
        dl."checkedInBy",
        pa.nama AS "namaPanitia"
      FROM public."DataLomba" dl
      LEFT JOIN public.panitia_accounts pa
        ON pa.id = dl."checkedInBy"
      WHERE dl."ticketToken" = $1
      LIMIT 1
    `,
    [token],
  );

  return result.rows[0] ?? null;
}

async function getParticipantDetails(
  ticket: TicketRow,
): Promise<ScanResult["participant"] | null> {
  let nama = "";
  let kategori = "";
  let kontak = "";
  let details: string[] = [];
  let members: string[] = [];

  switch (ticket.jenisLomba) {
    case "FUN_RUN": {
      const result = await scannerPool.query(
        `
          SELECT
            "namaLengkap",
            "jenisKelamin",
            "kontakDarurat",
            "noWhatsapp"
          FROM public."DetailFunRun"
          WHERE "dataLombaId" = $1
          LIMIT 1
        `,
        [ticket.id],
      );

      const data = result.rows[0];
      if (!data) return null;

      nama = data.namaLengkap;
      kategori = "Peserta Individu";
      kontak = data.noWhatsapp;
      details = [
        `Jenis Kelamin: ${data.jenisKelamin}`,
        `Kontak Darurat: ${data.kontakDarurat}`,
      ];
      break;
    }

    case "STMS": {
      const result = await scannerPool.query(
        `
          SELECT
            id,
            "namaPerwakilan",
            "kelas",
            "jenisBakat",
            "jumlahAnggota",
            "noWhatsapp"
          FROM public."DetailSTMS"
          WHERE "dataLombaId" = $1
          LIMIT 1
        `,
        [ticket.id],
      );

      const data = result.rows[0];
      if (!data) return null;

      nama = data.namaPerwakilan;
      kategori = "Talent Show";
      kontak = data.noWhatsapp;
      details = [
        `Kelas: ${data.kelas}`,
        `Jenis Bakat: ${data.jenisBakat}`,
        `Jumlah Anggota: ${data.jumlahAnggota}`,
      ];

      const memberResult = await scannerPool.query(
        `
          SELECT "namaLengkap"
          FROM public."AnggotaSTMS"
          WHERE "detailSTMSId" = $1
          ORDER BY id
        `,
        [data.id],
      );

      members = memberResult.rows.map((member) => member.namaLengkap);
      break;
    }

    case "CERDAS_CERMAT": {
      const result = await scannerPool.query(
        `
          SELECT
            id,
            "namaSekolah",
            "alamatSekolah",
            "namaGuruPendamping",
            "whatsappPendamping"
          FROM public."DetailCerdasCermat"
          WHERE "dataLombaId" = $1
          LIMIT 1
        `,
        [ticket.id],
      );

      const data = result.rows[0];
      if (!data) return null;

      nama = data.namaSekolah;
      kategori = "Cerdas Cermat";
      kontak = data.whatsappPendamping;
      details = [
        `Guru Pendamping: ${data.namaGuruPendamping}`,
        `Alamat sekolah: ${data.alamatSekolah}`,
      ];

      const memberResult = await scannerPool.query(
        `
          SELECT "namaLengkap", "kelas"
          FROM public."AnggotaCerdasCermat"
          WHERE "detailCerdasCermatId" = $1
          ORDER BY id
        `,
        [data.id],
      );

      members = memberResult.rows.map(
        (member) => `${member.namaLengkap} — Kelas ${member.kelas}`,
      );
      break;
    }

    case "MEWARNAI": {
      const result = await scannerPool.query(
        `
          SELECT
            "namaPeserta",
            "asalSekolah",
            "kelas",
            "usia",
            "namaOrangTua",
            "whatsappOrangTua",
            "paketLomba"
          FROM public."DetailMewarnai"
          WHERE "dataLombaId" = $1
          LIMIT 1
        `,
        [ticket.id],
      );

      const data = result.rows[0];
      if (!data) return null;

      nama = data.namaPeserta;
      kategori = data.paketLomba;
      kontak = data.whatsappOrangTua;
      details = [
        `Orangtua/Wali: ${data.namaOrangTua}`,
        `Sekolah: ${data.asalSekolah}`,
        `Kelas: ${data.kelas}`,
        `Usia: ${data.usia} tahun`,
      ];
      break;
    }

    default:
      return null;
  }

  return {
    id: ticket.id,
    orderId: ticket.orderId,
    jenisLomba: ticket.jenisLomba,
    nama,
    kategori,
    kontak,
    details,
    members,
    checkedInAt: ticket.checkedInAt
      ? new Date(ticket.checkedInAt).toISOString()
      : null,
    checkedInBy: ticket.namaPanitia,
  };
}

export async function processCheckIn(
  token: string,
  accountId: string,
): Promise<ScanResult> {
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return {
      status: "INVALID",
      message: "Format QR tidak valid.",
    };
  }

  const ticket = await getTicket(token);

  if (!ticket) {
    return {
      status: "INVALID",
      message: "Tiket tidak ditemukan.",
    };
  }

  if (ticket.statusBayar !== "PAID") {
    return {
      status: "UNPAID",
      message: "Pembayaran tiket belum dikonfirmasi.",
    };
  }

  if (ticket.checkedInAt) {
    return {
      status: "ALREADY_CHECKED_IN",
      message: "Tiket ini sudah pernah digunakan.",
      participant: (await getParticipantDetails(ticket)) ?? undefined,
    };
  }

  const update = await scannerPool.query(
    `
      UPDATE public."DataLomba"
      SET
        "checkedInAt" = NOW(),
        "checkedInBy" = $2
      WHERE
        "ticketToken" = $1
        AND "statusBayar" = 'PAID'
        AND "checkedInAt" IS NULL
      RETURNING
        id,
        "orderId",
        "jenisLomba",
        "statusBayar",
        "checkedInAt",
        "checkedInBy"
    `,
    [token, accountId],
  );

  if (update.rowCount === 0) {
    // Pemindaian lain mungkin berhasil lebih dahulu.
    const latestTicket = await getTicket(token);

    if (!latestTicket) {
      return {
        status: "INVALID",
        message: "Tiket tidak ditemukan.",
      };
    }

    if (latestTicket.statusBayar !== "PAID") {
      return {
        status: "UNPAID",
        message: "Pembayaran tiket belum dikonfirmasi.",
      };
    }

    return {
      status: "ALREADY_CHECKED_IN",
      message: "Tiket ini sudah pernah digunakan.",
      participant: (await getParticipantDetails(latestTicket)) ?? undefined,
    };
  }

  const checkedInTicket = await getTicket(token);

  if (!checkedInTicket) {
    return {
      status: "INVALID",
      message: "Tiket tidak ditemukan.",
    };
  }

  const participant = await getParticipantDetails(checkedInTicket);

  if (!participant) {
    return {
      status: "INVALID",
      message: "Data detail peserta tidak ditemukan.",
    };
  }

  return {
    status: "CHECKED_IN",
    message: "Check-in peserta berhasil.",
    participant,
  };
}
