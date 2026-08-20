import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User, UserRole } from "./types";
import { getUserByUsername } from "./data";

export const SESSION_COOKIE = "cms_session";

function secret() {
  // Set ADMIN_SECRET in .env for production. Falls back to a dev-only value.
  return process.env.ADMIN_SECRET || "dev-only-insecure-secret-change-me";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

/** password hash format: "<saltHex>:<hashHex>" (scrypt, 64-byte key) */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const testHash = crypto.scryptSync(password, salt, 64);
  const storedHash = Buffer.from(hash, "hex");
  if (testHash.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(testHash, storedHash);
}

/** Cookie value: base64url(username).hmacSignature — no server-side session table needed. */
function makeSessionValue(username: string): string {
  const payload = Buffer.from(username, "utf-8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/**
 * Verifies the signature and decodes the username. Pure/sync and only
 * touches `crypto`, so it's also safe to call from proxy.ts (edge/middleware
 * context), where the filesystem-backed data layer is not available.
 */
export function parseSessionValue(value: string | undefined | null): string | null {
  if (!value) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return Buffer.from(payload, "base64url").toString("utf-8");
  } catch {
    return null;
  }
}

export async function createSession(username: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, makeSessionValue(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the currently logged-in user (re-fetched from disk, so role/deletion is always fresh), or null. */
export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const username = parseSessionValue(store.get(SESSION_COOKIE)?.value);
  if (!username) return null;
  const user = await getUserByUsername(username);
  return user ?? null;
}

/** Redirects to "/" (the landing/login page) if not authenticated. Use in server components/pages. */
export async function requireSessionUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/");
  return user;
}

/** Redirects non-admins away. Use on admin-only pages/actions. */
export async function requireAdmin(): Promise<User> {
  const user = await requireSessionUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}

export function canManagePortfolio(sessionUser: User, targetUsername: string): boolean {
  return sessionUser.role === ("admin" as UserRole) || sessionUser.username === targetUsername;
}
