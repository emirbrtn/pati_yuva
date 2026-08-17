import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ error: "E-posta adresi gerekli." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, deletedAt: true },
  });

  if (!user || user.deletedAt) {
    return NextResponse.json({ message: "E-posta adresiniz kayıtlıysa sıfırlama bağlantısı gönderildi." });
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/sifre-sifirla?token=${token}`;

  console.log(`\n🔗 Şifre sıfırlama bağlantısı (${user.name}):\n${resetUrl}\n`);

  return NextResponse.json({ message: "E-posta adresiniz kayıtlıysa sıfırlama bağlantısı gönderildi.", resetUrl });
}
