import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/server/password";
import { prisma } from "@/lib/db";
import {
  createSession,
  setSessionCookie,
  toPublicUser,
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

  const { name, email, password, phone } = (body ?? {}) as Record<string, unknown>;

  const cleanName =
    typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  const cleanEmail =
    typeof email === "string" ? email.trim().toLocaleLowerCase("tr") : "";
  const cleanPassword = typeof password === "string" ? password : "";
  const cleanPhone = typeof phone === "string" ? phone.trim() : undefined;

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

  // Ad ve soyadı ayır
  const nameParts = cleanName.split(" ");
  const firstName = nameParts[0] ?? cleanName;
  const lastName = nameParts.slice(1).join(" ") || undefined;

  const existing = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Bu e-posta adresiyle bir hesap zaten mevcut." },
      { status: 409 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name: cleanName,
      firstName,
      lastName,
      email: cleanEmail,
      phone: cleanPhone || undefined,
      passwordHash: hashPassword(cleanPassword),
      role: "USER",
    },
  });

  const session = await createSession(user.id);

  const response = NextResponse.json(
    {
      user: toPublicUser(user),
      message: "Hesabınız oluşturuldu.",
    },
    { status: 201 }
  );
  return setSessionCookie(response, session.token);
}
