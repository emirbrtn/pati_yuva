import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import type { User } from "@/types/user";

export const SESSION_COOKIE = "patiyuva_session";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün

export type SessionCookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  path: "/";
  secure: boolean;
  maxAge: number;
};

export function sessionCookieOptions(): SessionCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return session;
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) return null;
  if (session.user.deletedAt) return null;

  return toPublicUser(session.user);
}

export async function destroySession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  });
}

export function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: Date;
}): User {
  return {
    id: user.id,
    name: user.name,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    email: user.email,
    phone: user.phone ?? undefined,
    role: user.role as User["role"],
    createdAt: user.createdAt.toISOString(),
  };
}
