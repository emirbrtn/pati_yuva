import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ favoriteIds: [], animals: [] });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    select: {
      animalId: true,
      animal: {
        select: {
          id: true,
          slug: true,
          name: true,
          species: true,
          breed: true,
          age: true,
          ageGroup: true,
          gender: true,
          city: true,
          district: true,
          adoptionStatus: true,
          sourceType: true,
          character: true,
          imageUrls: true,
          shelter: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const animals = favorites
    .filter((f) => f.animal)
    .map((f) => ({
      ...f.animal,
      imageUrls: JSON.parse(f.animal!.imageUrls ?? "[]"),
      status: f.animal!.adoptionStatus,
      shelterName: f.animal!.shelter?.name,
    }));

  return NextResponse.json({
    favoriteIds: favorites.map((f) => f.animalId),
    animals,
  });
}
