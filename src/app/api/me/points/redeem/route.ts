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
  const dealId = typeof data.dealId === "string" ? data.dealId : "";

  if (!dealId) {
    return NextResponse.json({ error: "Anlaşma ID gerekli." }, { status: 400 });
  }

  const deal = await prisma.sponsorDeal.findUnique({
    where: { id: dealId },
    include: { sponsor: { select: { id: true, name: true } } },
  });

  if (!deal || !deal.isActive) {
    return NextResponse.json({ error: "Anlaşma bulunamadı veya pasif." }, { status: 404 });
  }

  const userPoints = await prisma.userPoints.findUnique({
    where: { userId: user.id },
  });

  const available = (userPoints?.total ?? 0) - (userPoints?.spent ?? 0);

  if (available < deal.requiredPoints) {
    return NextResponse.json({ error: `Yetersiz puan. ${deal.requiredPoints} puan gerekiyor, ${available} puanınız var.` }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.userPoints.upsert({
      where: { userId: user.id },
      update: { spent: { increment: deal.requiredPoints } },
      create: { userId: user.id, total: 0, spent: deal.requiredPoints },
    });

    await tx.pointTransaction.create({
      data: {
        userId: user.id,
        amount: -deal.requiredPoints,
        type: "REDEEMED",
        description: `${deal.title} — ${deal.sponsor.name}`,
        sponsorId: deal.sponsor.id,
      },
    });
  });

  return NextResponse.json({
    message: "Puan başarıyla kullanıldı!",
    deal: {
      title: deal.title,
      sponsor: deal.sponsor.name,
      discountPercent: deal.discountPercent ?? undefined,
      discountAmount: deal.discountAmount ?? undefined,
    },
  });
}
