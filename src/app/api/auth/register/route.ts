import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/server/password";
import {
  readDb,
  saveDb,
  withId,
  toPublicUser,
} from "@/server/store";
import {
  createSession,
  setSessionCookie,
} from "@/server/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const { name, email, password } = (body ?? {}) as Record<string, unknown>;

  const cleanName =
    typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  const cleanEmail =
    typeof email === "string" ? email.trim().toLocaleLowerCase("tr") : "";
  const cleanPassword = typeof password === "string" ? password : "";

  if (cleanName.length < 2 || cleanName.length > 60) {
    return NextResponse.json(
      { error: "Ad soyad 2 ile 60 karakter arasında olmalıdır." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 200) {
    return NextResponse.json(
      { error: "Geçerli bir e-posta adresi girin." },
      { status: 400 }
    );
  }
  if (cleanPassword.length < 6 || cleanPassword.length > 100) {
    return NextResponse.json(
      { error: "Şifre en az 6 karakter olmalıdır." },
      { status: 400 }
    );
  }

  const db = await readDb();

  const existing = db.users.find(
    (user) => user.email.toLocaleLowerCase("tr") === cleanEmail
  );
  if (existing) {
    return NextResponse.json(
      { error: "Bu e-posta adresiyle bir hesap zaten mevcut." },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  const user = {
    id: withId(),
    name: cleanName,
    email: cleanEmail,
    role: "USER" as const,
    createdAt: now,
    passwordHash: hashPassword(cleanPassword),
  };

  db.users.push(user);

  const session = await createSession(user.id);
  db.sessions.push(session);

  await saveDb();

  const response = NextResponse.json(
    {
      user: toPublicUser(user),
      message: "Hesabınız oluşturuldu.",
    },
    { status: 201 }
  );
  return setSessionCookie(response, session.token);
}