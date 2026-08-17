import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const points = await prisma.userPoints.findUnique({
    where: { userId: user.id },
  });

  const recentTransactions = await prisma.pointTransaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      sponsor: { select: { name: true, logoUrl: true } },
    },
  });

  return NextResponse.json({
    points: {
      total: points?.total ?? 0,
      spent: points?.spent ?? 0,
      available: (points?.total ?? 0) - (points?.spent ?? 0),
    },
    transactions: recentTransactions.map((t) => ({
      id: t.id,
      amount: t.amount,
      type: t.type,
      description: t.description,
      sponsorName: t.sponsor?.name ?? undefined,
      createdAt: t.createdAt.toISOString(),
    })),
  });
}
