import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "MODERATOR"].includes(user.role)) {
    return NextResponse.json({ error: "Yetkiniz yok." }, { status: 403 });
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ logs });
}
