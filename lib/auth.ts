import "server-only";
import crypto from "node:crypto";

export const SESSION_COOKIE = "ea_admin";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("SESSION_SECRET env var is missing or too short (>=16 chars).");
  }
  return s;
}

function password(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error("ADMIN_PASSWORD env var is missing.");
  return p;
}

export function makeSessionToken(): string {
  return crypto.createHmac("sha256", secret()).update(password()).digest("hex");
}

export function isValidPassword(input: string): boolean {
  try {
    const a = Buffer.from(input);
    const b = Buffer.from(password());
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const expected = makeSessionToken();
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
