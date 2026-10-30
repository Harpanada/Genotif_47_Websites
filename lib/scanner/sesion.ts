import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "genotif_scanner_session";
const SESSION_DURATION = 60 * 60 * 12;

function getSecret() {
  const secret = process.env.SCANNER_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SCANNER_SESSION_SECRET belum dikonfigurasi.");
  }

  return new TextEncoder().encode(secret);
}

export type ScannerSession = {
  accountId: string;
  username: string;
  nama: string;
  role: "ADMIN" | "SCANNER";
};

export async function createScannerSession(session: ScannerSession) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function getScannerSession(): Promise<ScannerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (
      typeof payload.accountId !== "string" ||
      typeof payload.username !== "string" ||
      typeof payload.nama !== "string" ||
      !["ADMIN", "SCANNER"].includes(String(payload.role))
    ) {
      return null;
    }

    return {
      accountId: payload.accountId,
      username: payload.username,
      nama: payload.nama,
      role: payload.role as "ADMIN" | "SCANNER",
    };
  } catch {
    return null;
  }
}

export async function destroyScannerSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
