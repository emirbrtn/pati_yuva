import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import {
  readDb,
  toPublicUser,
  type StoredSession,
} from "@/server/store";
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

export async function createSession(userId: string): Promise<StoredSession> {
  const db = await readDb();
  const session: StoredSession = {
    token: createSessionToken(),
    userId,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
  db.sessions.push(session);
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

  const db = await readDb();
  const session = db.sessions.find((item) => item.token === token);
  if (!session) return null;
  if (Date.parse(session.expiresAt) < Date.now()) return null;

  const user = db.users.find((item) => item.id === session.userId);
  if (!user) return null;

  return toPublicUser(user);
}

export async function destroySession(token: string): Promise<void> {
  const db = await readDb();
  db.sessions = db.sessions.filter((item) => item.token !== token);
}