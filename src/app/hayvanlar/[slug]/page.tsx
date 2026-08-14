import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdoptSection } from "@/components/AdoptSection";
import { AnimalGallery } from "@/components/AnimalGallery";
import { FavoriteButton } from "@/components/FavoriteButton";
import { SourceBadge, StatusBadge } from "@/components/StatusBadge";
import { healthFieldMeta, healthFieldList } from "@/lib/status";
import { getShelterById } from "@/lib/relations";
import { prisma } from "@/lib/db";

type AnimalDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: AnimalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const animal = await prisma.animal.findUnique({ where: { slug } });

  if (!animal) {
    return { title: "Hayvan bulunamadı | PatiYuva" };
  }

  return {
    title: `${animal.name} | PatiYuva`,
    description: animal.character,
  };
}

export default async function AnimalDetailPage({
  params,
}: AnimalDetailPageProps) {
  const { slug } = await params;
  const dbAnimal = await prisma.animal.findUnique({ where: { slug } });

  if (!dbAnimal) {
    notFound();
  }

  // DB animal'ı Animal tipine dönüştür
  const parseBool = (v: number | null): boolean | null => {
    if (v === null || v === undefined) return null;
    return v === 1;
  };

  const animal = {
    id: dbAnimal.id,
    slug: dbAnimal.slug,
    name: dbAnimal.name,
    species: dbAnimal.species,
    breed: dbAnimal.breed ?? undefined,
    gender: dbAnimal.gender,
    age: dbAnimal.age ?? undefined,
    birthDate: dbAnimal.birthDate ?? undefined,
    ageGroup: dbAnimal.ageGroup,
    size: dbAnimal.size,
    color: dbAnimal.color ?? undefined,
    city: dbAnimal.city,
    district: dbAnimal.district ?? undefined,
    shelterId: dbAnimal.shelterId ?? undefined,
    ownerName: dbAnimal.ownerName ?? undefined,
    sourceType: dbAnimal.sourceType as "SHELTER" | "USER",
    dataSourceType: dbAnimal.dataSourceType as "OFFICIAL" | "DEMO",
    sourceUrl: dbAnimal.sourceUrl ?? undefined,
    status: dbAnimal.adoptionStatus as any,
    character: dbAnimal.character,
    description: dbAnimal.description,
    healthDescription: dbAnimal.healthDescription ?? undefined,
    energyLevel: dbAnimal.energyLevel as any,
    specialNeeds: dbAnimal.specialNeeds ?? undefined,
    goodWithChildren: parseBool(dbAnimal.goodWithChildren),
    goodWithDogs: parseBool(dbAnimal.goodWithDogs),
    goodWithCats: parseBool(dbAnimal.goodWithCats),
    homeSuitable: parseBool(dbAnimal.homeSuitable),
    gardenRequired: parseBool(dbAnimal.gardenRequired),
    traits: JSON.parse(dbAnimal.traits ?? "[]"),
    health: {
      vaccinated: parseBool(dbAnimal.vaccinated),
      neutered: parseBool(dbAnimal.neutered),
      microchipped: parseBool(dbAnimal.microchipped),
      healthChecked: parseBool(dbAnimal.healthChecked),
    },
    microchipNumber: dbAnimal.microchipNumber ?? undefined,
    imageUrls: JSON.parse(dbAnimal.imageUrls ?? "[]"),
    createdAt: dbAnimal.createdAt.toISOString(),
    updatedAt: dbAnimal.updatedAt?.toISOString(),
    lastVerifiedAt: dbAnimal.lastVerifiedAt?.toISOString(),
    isDemo: dbAnimal.isDemo,
  };

  const shelter = await getShelterById(animal.shelterId);
  const location = animal.district
    ? `${animal.city} / ${animal.district}`
    : animal.city;

  return (
    <main className="bg-[#fffaf4]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
        <div>
          <Link
            href="/hayvanlar"
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          >
            ← Hayvanlara geri dön
          </Link>
          <div className="mt-5">
            <AnimalGallery name={animal.name} imageUrls={animal.imageUrls} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-4xl font-bold text-stone-950 sm:text-5xl">
                  {animal.name}
                </h1>
                <StatusBadge status={animal.status} size="md" />
              </div>
              <FavoriteButton animalId={animal.id} label={`${animal.name} favorilere ekle`} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                {animal.species}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-stone-800">
                📍 {location}
              </span>
              <SourceBadge source={animal.sourceType} />
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-stone-600">
              <span>{animal.age}</span>
              <span aria-hidden="true">•</span>
              <span>{animal.gender}</span>
              {animal.breed ? (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{animal.breed}</span>
                </>
              ) : null}
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {shelter || animal.ownerName ? (
                <div className="col-span-full rounded-2xl bg-stone-100 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {shelter ? "Barınak" : "İlan sahibi"}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-stone-950">
                    {shelter ? (
                      <Link
                        href={`/barinaklar/${shelter.slug}`}
                        className="text-emerald-800 hover:text-emerald-950"
                      >
                        {shelter.name}
                      </Link>
                    ) : (
                      `Bireysel sahiplendirme - ${animal.ownerName}`
                    )}
                  </dd>
                </div>
              ) : null}
              {[
                ["Yaş grubu", animal.ageGroup],
                ["Yaş", animal.age],
                ["Cinsiyet", animal.gender],
                ["Şehir", animal.city],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-stone-100 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-stone-950">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <AdoptSection animal={animal as any} />
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-bold text-stone-950">
                {animal.name} hakkında
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-700">
                {animal.description}
              </p>
              {animal.healthDescription ? (
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  {animal.healthDescription}
                </p>
              ) : null}
            </div>
            <div>
              {animal.traits.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                    Özellikler
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {animal.traits.map((trait: string) => (
                      <li
                        key={trait}
                        className="rounded-full border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-sm font-medium text-stone-800"
                      >
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                  Sağlık Durumu
                </h3>
                <ul className="mt-4 space-y-3">
                  {healthFieldList.map((field) => {
                    const value = animal.health[field];
                    const known = value !== null && value !== undefined;
                    return (
                      <li
                        key={field}
                        className="flex items-center gap-3 text-sm text-stone-700"
                      >
                        {known && value ? (
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                        ) : known && !value ? (
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-600"
                            aria-hidden="true"
                          >
                            ✕
                          </span>
                        ) : (
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs text-stone-500"
                            aria-hidden="true"
                          >
                            ?
                          </span>
                        )}
                        <span className="font-medium">
                          {healthFieldMeta[field].label}
                        </span>
                        {!known ? (
                          <span className="text-xs text-stone-400">
                            – Bilgi bulunmuyor
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
