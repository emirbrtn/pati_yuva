import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ favoriteIds: [] });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: { animalId: true },
  });

  return NextResponse.json({
    favoriteIds: favorites.map((f) => f.animalId),
  });
}
