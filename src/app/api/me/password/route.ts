import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/server/password";

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const currentPassword = typeof data.currentPassword === "string" ? data.currentPassword : "";
  const newPassword = typeof data.newPassword === "string" ? data.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Mevcut ve yeni şifre zorunludur." },
      { status: 400 }
    );
  }

  if (newPassword.length < 6 || newPassword.length > 100) {
    return NextResponse.json(
      { error: "Yeni şifre en az 6 karakter olmalıdır." },
      { status: 400 }
    );
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });

  if (!fullUser || !verifyPassword(currentPassword, fullUser.passwordHash)) {
    return NextResponse.json(
      { error: "Mevcut şifreniz hatalı." },
      { status: 401 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashPassword(newPassword) },
  });

  return NextResponse.json({ message: "Şifreniz güncellendi." });
}
