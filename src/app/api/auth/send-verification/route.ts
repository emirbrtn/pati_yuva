import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ message: "E-posta adresiniz zaten doğrulanmış." });
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}dogrula?token=${token}`;

  console.log(`\n📧 E-posta doğrulama bağlantısı (${user.name}):\n${verifyUrl}\n`);

  return NextResponse.json({ message: "Doğrulama bağlantısı oluşturuldu.", verifyUrl });
}
