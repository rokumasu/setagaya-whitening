import { createHash } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(password).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && password === expected;
}

export async function createAdminSession() {
  const token = expectedToken();
  if (!token) return;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;

  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === expected;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
