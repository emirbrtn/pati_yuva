import type { Metadata } from "next";
import { SheltersBrowser } from "@/components/SheltersBrowser";
import { prisma } from "@/lib/db";
import type { Shelter } from "@/types/shelter";

export const metadata: Metadata = {
  title: "Barınaklar | PatiYuva",
  description:
    "Türkiye'deki barınakları keşfet; barınak adı, konum ve sahiplendirilebilir hayvan sayılarını gör.",
};

export default async function SheltersPage() {
  const shelters = await prisma.shelter.findMany({
    orderBy: [
      { verified: "desc" },
      { name: "asc" },
    ],
  });

  const formattedShelters: Shelter[] = shelters.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    verified: s.verified,
    isDemo: s.isDemo,
    dataSourceType: s.dataSourceType as "OFFICIAL" | "DEMO",
    verificationStatus: s.verificationStatus as any,
    description: s.description ?? "",
    city: s.city,
    district: s.district ?? "",
    address: s.address ?? undefined,
    phone: s.phone ?? undefined,
    email: s.email ?? undefined,
    website: s.website ?? undefined,
    workingHours: s.workingHours ?? undefined,
    imageUrl: s.imageUrl ?? undefined,
    images: [],
    municipalityId: s.municipalityId ?? undefined,
    municipalityName: undefined,
    contactUnit: s.contactUnit ?? undefined,
    capacity: s.capacity ?? undefined,
    services: JSON.parse(s.services ?? "[]"),
    latitude: s.latitude ?? undefined,
    longitude: s.longitude ?? undefined,
    officialSourceUrl: s.officialSourceUrl ?? undefined,
    verifiedAt: s.verifiedAt?.toISOString() ?? undefined,
    verifiedBy: s.verifiedBy ?? undefined,
    lastVerifiedAt: s.lastVerifiedAt?.toISOString() ?? undefined,
    adminUserIds: [],
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt?.toISOString() ?? undefined,
  }));

  return (
    <main className="bg-[#fffaf4]">
      <section className="border-b border-stone-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Barınaklar
            </p>
            <h1 className="mt-3 text-4xl font-bold text-stone-950 sm:text-5xl">
              Türkiye&apos;deki barınaklar tek merkezde.
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Her barınakta sahiplendirilmeyi bekleyen kaç dost olduğunu gör,
              doğrulanmış profillerden iletişime geç.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SheltersBrowser shelters={formattedShelters} />
        </div>
      </section>
    </main>
  );
}
