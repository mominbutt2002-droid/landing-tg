import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function createAdminSessionToken(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }
  return createHmac("sha256", secret).update("nexus-admin-v1").digest("hex");
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const expected = createAdminSessionToken();
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}
