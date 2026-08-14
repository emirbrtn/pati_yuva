import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

type FavoriteParams = {
  params: Promise<{ animalId: string }>;
};

export async function POST(request: NextRequest, { params }: FavoriteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  const { animalId } = await params;

  // Hayvan var mı kontrol
  const animal = await prisma.animal.findUnique({ where: { id: animalId } });
  if (!animal) {
    return NextResponse.json({ error: "Hayvan bulunamadı." }, { status: 404 });
  }

  // Zaten favoride mi
  const existing = await prisma.favorite.findUnique({
    where: { userId_animalId: { userId: user.id, animalId } },
  });

  if (!existing) {
    await prisma.favorite.create({
      data: { userId: user.id, animalId },
    });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { animalId: true },
  });

  return NextResponse.json({
    favoriteIds: favorites.map((f) => f.animalId),
    message: "Favorilere eklendi.",
  });
}

export async function DELETE(request: NextRequest, { params }: FavoriteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Oturum bulunamadı." }, { status: 401 });
  }

  const { animalId } = await params;

  await prisma.favorite.deleteMany({
    where: { userId: user.id, animalId },
  });

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { animalId: true },
  });

  return NextResponse.json({
    favoriteIds: favorites.map((f) => f.animalId),
    message: "Favorilerden kaldırıldı.",
  });
}
