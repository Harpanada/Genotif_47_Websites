import "server-only";

import { scannerPool } from "@/lib/scanner/db";
import bcrypt from "bcryptjs";

export type ScannerAccount = {
  id: string;
  username: string;
  nama: string;
  role: "ADMIN" | "SCANNER";
};

export async function authenticateScanner(
  username: string,
  password: string,
): Promise<ScannerAccount | null> {
  const result = await scannerPool.query(
    `
      SELECT id, username, nama, role, password_hash
      FROM public.panitia_accounts
      WHERE LOWER(username) = LOWER($1)
        AND is_active = TRUE
      LIMIT 1
    `,
    [username.trim()],
  );

  const account = result.rows[0];

  if (!account) return null;

  const passwordValid = await bcrypt.compare(password, account.password_hash);

  if (!passwordValid) return null;

  return {
    id: account.id,
    username: account.username,
    nama: account.nama,
    role: account.role,
  };
}

export async function getScannerAccountById(
  accountId: string,
): Promise<ScannerAccount | null> {
  const result = await scannerPool.query(
    `
      SELECT id, username, nama, role
      FROM public.panitia_accounts
      WHERE id = $1
        AND is_active = TRUE
      LIMIT 1
    `,
    [accountId],
  );

  const account = result.rows[0];

  if (!account) return null;

  return {
    id: account.id,
    username: account.username,
    nama: account.nama,
    role: account.role,
  };
}
