import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const avatarUrl = typeof data.avatarUrl === "string" ? data.avatarUrl.trim() : "";

  if (!avatarUrl) {
    return NextResponse.json({ error: "Fotoğraf URL'i gerekli." }, { status: 400 });
  }

  try {
    new URL(avatarUrl);
  } catch {
    return NextResponse.json({ error: "Geçerli bir URL girin." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl },
    select: { id: true, avatarUrl: true },
  });

  return NextResponse.json({ avatarUrl: updated.avatarUrl });
}
