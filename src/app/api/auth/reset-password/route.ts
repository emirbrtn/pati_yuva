import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/server/password";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const token = typeof data.token === "string" ? data.token.trim() : "";
  const password = typeof data.password === "string" ? data.password : "";

  if (!token || !password) {
    return NextResponse.json({ error: "Token ve şifre gerekli." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Şifre en az 6 karakter olmalıdır." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
      deletedAt: null,
    },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Geçersiz veya süresi dolmuş token." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  await prisma.session.deleteMany({ where: { userId: user.id } });

  return NextResponse.json({ message: "Şifreniz başarıyla sıfırlandı. Yeniden giriş yapın." });
}
