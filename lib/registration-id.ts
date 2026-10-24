import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  registrationPool?: Pool;
};

const pool =
  globalForPg.registrationPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.registrationPool = pool;
}

type JenisLomba = "FUN_RUN" | "STMS" | "CERDAS_CERMAT" | "MEWARNAI";

const CONFIG: Record<JenisLomba, { sequence: string; prefix: string }> = {
  FUN_RUN: {
    sequence: "public.seq_pe_fun_run",
    prefix: "G47-PEFR",
  },
  STMS: {
    sequence: "public.seq_pe_stms",
    prefix: "G47-PESTMS",
  },
  CERDAS_CERMAT: {
    sequence: "public.seq_pe_lcc",
    prefix: "G47-PELCC",
  },
  MEWARNAI: {
    sequence: "public.seq_pe_mewarnai",
    prefix: "G47-PEMW",
  },
};

export async function generateRegistrationId(
  jenisLomba: JenisLomba,
): Promise<string> {
  const { sequence, prefix } = CONFIG[jenisLomba];

  const result = await pool.query<{ nomor: string }>(
    "SELECT nextval($1::regclass)::text AS nomor",
    [sequence],
  );

  const nomor = Number(result.rows[0]?.nomor);

  if (!Number.isSafeInteger(nomor) || nomor < 1) {
    throw new Error("Gagal menghasilkan nomor registrasi.");
  }

  return `${prefix}-${String(nomor).padStart(4, "0")}`;
}

export function formatDetailId(registrationId: string): string {
  return `${registrationId}-D01`;
}

export function formatMemberId(
  registrationId: string,
  nomorAnggota: number,
): string {
  return `${registrationId}-A${String(nomorAnggota).padStart(2, "0")}`;
}
