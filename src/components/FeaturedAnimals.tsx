import { AnimalGrid } from "@/components/AnimalGrid";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeader } from "@/components/SectionHeader";
import { prisma } from "@/lib/db";
import type { Animal, AnimalSpecies, AnimalGender, AgeGroup, AnimalSize, EnergyLevel, AnimalStatus } from "@/types/animal";

export async function FeaturedAnimals() {
  const animals = await prisma.animal.findMany({
    where: { adoptionStatus: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const parseBool = (v: number | null): boolean | null => {
    if (v === null || v === undefined) return null;
    return v === 1;
  };

  const formatted: Animal[] = animals.map((a) => ({
    id: a.id,
    slug: a.slug,
    name: a.name,
    species: a.species as AnimalSpecies,
    breed: a.breed ?? undefined,
    gender: a.gender as AnimalGender,
    age: a.age ?? "",
    birthDate: a.birthDate ?? undefined,
    ageGroup: a.ageGroup as AgeGroup,
    size: a.size as AnimalSize,
    color: a.color ?? undefined,
    city: a.city,
    district: a.district ?? undefined,
    shelterId: a.shelterId ?? undefined,
    ownerName: a.ownerName ?? undefined,
    sourceType: a.sourceType as "SHELTER" | "USER",
    dataSourceType: a.dataSourceType as "OFFICIAL" | "DEMO",
    sourceUrl: a.sourceUrl ?? undefined,
    status: a.adoptionStatus as AnimalStatus,
    character: a.character,
    description: a.description,
    healthDescription: a.healthDescription ?? undefined,
    energyLevel: a.energyLevel as EnergyLevel,
    specialNeeds: a.specialNeeds ?? undefined,
    goodWithChildren: parseBool(a.goodWithChildren),
    goodWithDogs: parseBool(a.goodWithDogs),
    goodWithCats: parseBool(a.goodWithCats),
    homeSuitable: parseBool(a.homeSuitable),
    gardenRequired: parseBool(a.gardenRequired),
    traits: JSON.parse(a.traits ?? "[]"),
    health: {
      vaccinated: parseBool(a.vaccinated),
      neutered: parseBool(a.neutered),
      microchipped: parseBool(a.microchipped),
      healthChecked: parseBool(a.healthChecked),
    },
    microchipNumber: a.microchipNumber ?? undefined,
    imageUrls: JSON.parse(a.imageUrls ?? "[]"),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt?.toISOString(),
    lastVerifiedAt: a.lastVerifiedAt?.toISOString(),
    isDemo: a.isDemo,
  }));

  return (
    <section className="bg-[#fffaf4] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Öne çıkan dostlar"
          title="Yuva arayan hayvanları yakından tanı."
          description="Her kartta temel bilgiler, barınak adı ve karakter özeti yer alır."
        />
        <div className="mt-10">
          <AnimalGrid animals={formatted} />
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/hayvanlar" variant="secondary">
            Tüm Hayvanları Gör
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
