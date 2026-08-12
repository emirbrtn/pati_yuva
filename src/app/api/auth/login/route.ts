import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/server/password";
import {
  readDb,
  saveDb,
  toPublicUser,
} from "@/server/store";
import {
  createSession,
  setSessionCookie,
} from "@/server/auth";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek gövdesi." },
      { status: 400 }
    );
  }

  const { email, password } = (body ?? {}) as Record<string, unknown>;

  const cleanEmail =
    typeof email === "string" ? email.trim().toLocaleLowerCase("tr") : "";
  const cleanPassword = typeof password === "string" ? password : "";

  if (!cleanEmail || !cleanPassword) {
    return NextResponse.json(
      { error: "E-posta ve şifre zorunludur." },
      { status: 400 }
    );
  }

  const db = await readDb();
  const user = db.users.find(
    (item) => item.email.toLocaleLowerCase("tr") === cleanEmail
  );

  if (!user || !verifyPassword(cleanPassword, user.passwordHash)) {
    return NextResponse.json(
      { error: "E-posta veya şifre hatalı." },
      { status: 401 }
    );
  }

  const session = await createSession(user.id);
  db.sessions.push(session);
  await saveDb();

  const response = NextResponse.json({
    user: toPublicUser(user),
    message: "Giriş başarılı.",
  });
  return setSessionCookie(response, session.token);
}