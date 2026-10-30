import "server-only";

import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  scannerPool?: Pool;
};

export const scannerPool =
  globalForPg.scannerPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.scannerPool = scannerPool;
}
