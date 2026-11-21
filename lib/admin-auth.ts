import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function isAuthEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim().length > 0);
}

function getSigningSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  return secret.trim();
}

function sha256(value: string): Buffer {
  return crypto.createHash("sha256").update(value).digest();
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return true;
  return crypto.timingSafeEqual(sha256(candidate), sha256(expected));
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  const signature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!isAuthEnabled()) return true;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, providedSignature] = parts;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("hex");

  const providedBuf = Buffer.from(providedSignature, "utf8");
  const expectedBuf = Buffer.from(expectedSignature, "utf8");
  if (providedBuf.length !== expectedBuf.length) return false;

  return crypto.timingSafeEqual(providedBuf, expectedBuf);
}

export function isAdminAuthenticated(): boolean {
  if (!isAuthEnabled()) return true;
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export function getSessionCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
