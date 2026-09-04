import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE = "luna_session";

function secret() {
  return process.env.DEMO_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  workspaceId: string;
  role: string;
};

export async function createSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  const sig = sign(payload);
  const value = `${payload}.${sig}`;
  const jar = await cookies();
  jar.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}

export async function loginWithCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  const session: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    workspaceId: user.workspaceId,
    role: user.role,
  };
  await createSession(session);
  return session;
}

export async function loginDemo() {
  const user = await prisma.user.findUnique({ where: { email: "admin@maycode.pe" } });
  if (!user) throw new Error("Demo user missing — run db:seed");
  const session: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    workspaceId: user.workspaceId,
    role: user.role,
  };
  await createSession(session);
  return session;
}
