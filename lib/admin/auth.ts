import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

const SESSION_COOKIE = "genotif_admin_session";
const SESSION_DURATION = 60 * 60 * 8; // 8 jam
const SESSION_ISSUER = "genotif-admin";
const SESSION_AUDIENCE = "genotif-admin-dashboard";

function getSessionSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret || new TextEncoder().encode(secret).length < 32) {
    throw new Error("AUTH_SECRET belum dikonfigurasi dengan aman.");
  }

  return new TextEncoder().encode(secret);
}

// export async function verifyAdminCredentials(
//   username: string,
//   password: string,
// ): Promise<boolean> {
//   const adminUsername = process.env.ADMIN_USERNAME;
//   const passwordHash = process.env.ADMIN_PASSWORD_HASH;

//   if (!adminUsername || !passwordHash || !username || !password) {
//     return false;
//   }

//   if (username !== adminUsername) {
//     return false;
//   }

//   try {
//     return await compare(password, passwordHash);
//   } catch {
//     return false;
//   }
// }
export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  console.log("[AUTH DEBUG]", {
    usernameProvided: Boolean(username),
    adminUsernameConfigured: Boolean(adminUsername),
    usernameMatches:
      Boolean(adminUsername) && username.trim() === adminUsername?.trim(),
    passwordHashConfigured: Boolean(passwordHash),
    passwordHashLength: passwordHash?.length ?? 0,
  });

  if (!adminUsername || !passwordHash || !username || !password) {
    return false;
  }

  if (username.trim() !== adminUsername.trim()) {
    return false;
  }

  try {
    // return await compare(password, passwordHash);
    const passwordMatches = await compare(password, passwordHash);

    console.log("[AUTH DEBUG] Password matches:", passwordMatches);

    return passwordMatches;
  } catch {
    return false;
  }
}
export async function createAdminSession(username: string): Promise<void> {
  const secret = getSessionSecret();

  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return false;

    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });

    return (
      payload.role === "admin" && payload.sub === process.env.ADMIN_USERNAME
    );
  } catch {
    return false;
  }
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
