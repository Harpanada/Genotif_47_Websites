import { randomBytes } from "node:crypto";

export function generateTicketToken(): string {
  return randomBytes(32).toString("hex");
}
