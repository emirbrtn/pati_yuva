import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const confirm = typeof data.confirm === "string" ? data.confirm : "";

  if (confirm !== "HESABIMI_SIL") {
    return NextResponse.json({ error: 'Onay için "HESABIMI_SIL" yazmalısınız.' }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { deletedAt: new Date() },
    });
    await tx.session.deleteMany({ where: { userId: user.id } });
  });

  const response = NextResponse.json({ message: "Hesabınız başarıyla silindi." });
  response.cookies.set("patiyuva_session", "", { maxAge: 0, path: "/" });

  return response;
}
