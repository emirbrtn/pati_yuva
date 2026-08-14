import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const where: Record<string, unknown> = {};

  const status = searchParams.get("status");
  if (status === "active") {
    where.adoptionStatus = { not: "ADOPTED" };
  } else if (status) {
    where.adoptionStatus = status;
  }

  const species = searchParams.get("species");
  if (species) where.species = species;

  const gender = searchParams.get("gender");
  if (gender) where.gender = gender;

  const ageGroup = searchParams.get("ageGroup");
  if (ageGroup) where.ageGroup = ageGroup;

  const city = searchParams.get("city");
  if (city) where.city = city;

  const district = searchParams.get("district");
  if (district) where.district = district;

  const shelterId = searchParams.get("shelterId");
  if (shelterId) where.shelterId = shelterId;

  const search = searchParams.get("search");
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { breed: { contains: search } },
      { description: { contains: search } },
      { character: { contains: search } },
    ];
  }

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
    birthDate: a.birthDate ?? undefined,
    ageGroup: a.ageGroup,
    size: a.size,
    gender: a.gender,
    color: a.color ?? undefined,
    city: a.city,
    district: a.district ?? undefined,
    shelterId: a.shelterId ?? undefined,
    ownerName: a.ownerName ?? undefined,
    sourceType: a.sourceType,
    dataSourceType: a.dataSourceType,
    sourceUrl: a.sourceUrl ?? undefined,
    status: a.adoptionStatus,
    character: a.character,
    description: a.description,
    healthDescription: a.healthDescription ?? undefined,
    energyLevel: a.energyLevel,
    specialNeeds: a.specialNeeds ?? undefined,
    goodWithChildren: a.goodWithChildren === 1 ? true : a.goodWithChildren === 0 ? false : null,
    goodWithDogs: a.goodWithDogs === 1 ? true : a.goodWithDogs === 0 ? false : null,
    goodWithCats: a.goodWithCats === 1 ? true : a.goodWithCats === 0 ? false : null,
    homeSuitable: a.homeSuitable === 1 ? true : a.homeSuitable === 0 ? false : null,
    gardenRequired: a.gardenRequired === 1 ? true : a.gardenRequired === 0 ? false : null,
    traits: JSON.parse(a.traits ?? "[]"),
    health: {
      vaccinated: a.vaccinated === 1 ? true : a.vaccinated === 0 ? false : null,
      neutered: a.neutered === 1 ? true : a.neutered === 0 ? false : null,
      microchipped: a.microchipped === 1 ? true : a.microchipped === 0 ? false : null,
      healthChecked: a.healthChecked === 1 ? true : a.healthChecked === 0 ? false : null,
    },
    microchipNumber: a.microchipNumber ?? undefined,
    imageUrls: JSON.parse(a.imageUrls ?? "[]"),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt?.toISOString(),
    lastVerifiedAt: a.lastVerifiedAt?.toISOString(),
  }));

  return NextResponse.json({ animals: formatted });
}
