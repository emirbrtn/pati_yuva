import { prisma } from "@/lib/db";
import type { Animal, AnimalStatus } from "@/types/animal";
import type { Shelter } from "@/types/shelter";

// ─── Hayvan yardimcilari ───────────────────────────────────

function dbAnimalToAnimal(db: any): Animal {
  const parseBool = (v: number | null): boolean | null => {
    if (v === null || v === undefined) return null;
    return v === 1;
  };

  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    species: db.species,
    breed: db.breed ?? undefined,
    gender: db.gender,
    age: db.age ?? undefined,
    birthDate: db.birthDate ?? undefined,
    ageGroup: db.ageGroup,
    size: db.size,
    color: db.color ?? undefined,
    city: db.city,
    district: db.district ?? undefined,
    shelterId: db.shelterId ?? undefined,
    ownerName: db.ownerName ?? undefined,
    sourceType: db.sourceType as "SHELTER" | "USER",
    dataSourceType: db.dataSourceType as "OFFICIAL" | "DEMO",
    sourceUrl: db.sourceUrl ?? undefined,
    status: db.adoptionStatus as AnimalStatus,
    character: db.character,
    description: db.description,
    healthDescription: db.healthDescription ?? undefined,
    energyLevel: db.energyLevel as any,
    specialNeeds: db.specialNeeds ?? undefined,
    goodWithChildren: parseBool(db.goodWithChildren),
    goodWithDogs: parseBool(db.goodWithDogs),
    goodWithCats: parseBool(db.goodWithCats),
    homeSuitable: parseBool(db.homeSuitable),
    gardenRequired: parseBool(db.gardenRequired),
    traits: JSON.parse(db.traits ?? "[]"),
    health: {
      vaccinated: parseBool(db.vaccinated),
      neutered: parseBool(db.neutered),
      microchipped: parseBool(db.microchipped),
      healthChecked: parseBool(db.healthChecked),
    },
    microchipNumber: db.microchipNumber ?? undefined,
    imageUrls: JSON.parse(db.imageUrls ?? "[]"),
    createdAt: db.createdAt?.toISOString?.() ?? String(db.createdAt),
    updatedAt: db.updatedAt?.toISOString?.() ?? undefined,
    lastVerifiedAt: db.lastVerifiedAt?.toISOString?.() ?? undefined,
    isDemo: db.isDemo,
  };
}

export async function getShelterById(id?: string): Promise<Shelter | undefined> {
  if (!id) return undefined;
  const db = await prisma.shelter.findUnique({ where: { id } });
  if (!db) return undefined;
  return dbShelterToShelter(db);
}

export async function getShelterBySlug(slug: string): Promise<Shelter | undefined> {
  const db = await prisma.shelter.findUnique({ where: { slug } });
  if (!db) return undefined;
  return dbShelterToShelter(db);
}

export async function getShelterNameById(id?: string): Promise<string> {
  if (!id) return "Bireysel İlan";
  const shelter = await getShelterById(id);
  return shelter?.name ?? "Bireysel İlan";
}

export async function getAnimalsByShelterId(shelterId: string): Promise<Animal[]> {
  const dbs = await prisma.animal.findMany({
    where: {
      shelterId,
      adoptionStatus: { not: "ADOPTED" },
    },
    orderBy: { createdAt: "desc" },
  });
  return dbs.map(dbAnimalToAnimal);
}

export async function getActiveAnimals(): Promise<Animal[]> {
  const dbs = await prisma.animal.findMany({
    where: { adoptionStatus: { not: "ADOPTED" } },
    orderBy: { createdAt: "desc" },
  });
  return dbs.map(dbAnimalToAnimal);
}

export async function getShelterStats(shelterId: string) {
  const list = await prisma.animal.findMany({
    where: {
      shelterId,
      adoptionStatus: { not: "ADOPTED" },
    },
  });

  return {
    total: list.length,
    cats: list.filter((a) => a.species === "Kedi").length,
    dogs: list.filter((a) => a.species === "Köpek").length,
    others: list.filter((a) => !["Kedi", "Köpek"].includes(a.species)).length,
  };
}

export async function getCities(): Promise<string[]> {
  const results = await prisma.animal.findMany({
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return results.map((r) => r.city);
}

export async function getDistrictsForCity(city: string): Promise<string[]> {
  const results = await prisma.animal.findMany({
    where: { city },
    select: { district: true },
    distinct: ["district"],
  });
  return results
    .map((r) => r.district)
    .filter((d): d is string => Boolean(d))
    .sort();
}

export async function getShelterOptions() {
  const shelters = await prisma.shelter.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return shelters;
}

// ─── Shelter donusum ───────────────────────────────────────

function dbShelterToShelter(db: any): Shelter {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    verified: db.verified,
    isDemo: db.isDemo,
    dataSourceType: db.dataSourceType,
    verificationStatus: db.verificationStatus,
    description: db.description ?? "",
    city: db.city,
    district: db.district ?? "",
    address: db.address ?? undefined,
    phone: db.phone ?? undefined,
    email: db.email ?? undefined,
    website: db.website ?? undefined,
    workingHours: db.workingHours ?? undefined,
    imageUrl: db.imageUrl ?? undefined,
    images: [],
    municipalityId: db.municipalityId ?? undefined,
    municipalityName: undefined,
    contactUnit: db.contactUnit ?? undefined,
    capacity: db.capacity ?? undefined,
    services: JSON.parse(db.services ?? "[]"),
    latitude: db.latitude ?? undefined,
    longitude: db.longitude ?? undefined,
    officialSourceUrl: db.officialSourceUrl ?? undefined,
    verifiedAt: db.verifiedAt?.toISOString?.() ?? undefined,
    verifiedBy: db.verifiedBy ?? undefined,
    lastVerifiedAt: db.lastVerifiedAt?.toISOString?.() ?? undefined,
    adminUserIds: [],
    createdAt: db.createdAt?.toISOString?.() ?? String(db.createdAt),
    updatedAt: db.updatedAt?.toISOString?.() ?? undefined,
  };
}

// ─── Suncu tarafinda kullanilan eszamanli versiyonlar ──────
// Bu fonksiyonlar sayfa component'leri icin server-side'da kullanilir

export function getShelterByIdSync(id?: string): Shelter | undefined {
  if (!id) return undefined;
  // Bu fonksiyon server component'lerde kullanilir
  // Gercek kullanimda async olanlar tercih edilmeli
  return undefined;
}

export function getShelterBySlugSync(slug: string): Shelter | undefined {
  return undefined;
}
