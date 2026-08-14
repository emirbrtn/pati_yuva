import { NextRequest, NextResponse } from "next/server";
import { getShelterAdminContext } from "@/server/shelter-admin";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const ctx = await getShelterAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { shelterId: ctx.shelterId };
  if (status) where.adoptionStatus = status;

  const animals = await prisma.animal.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const formatted = animals.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    species: a.species,
    breed: a.breed ?? undefined,
    age: a.age,
    ageGroup: a.ageGroup,
    gender: a.gender,
    status: a.adoptionStatus,
    city: a.city,
    district: a.district ?? undefined,
    imageUrls: JSON.parse(a.imageUrls ?? "[]"),
    createdAt: a.createdAt.toISOString(),
  }));

  return NextResponse.json({ animals: formatted });
}
