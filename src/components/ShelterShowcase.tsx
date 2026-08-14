import { SectionHeader } from "@/components/SectionHeader";
import { ShelterGrid } from "@/components/ShelterGrid";
import { prisma } from "@/lib/db";

export async function ShelterShowcase() {
  const shelters = await prisma.shelter.findMany({
    where: { verified: true },
    orderBy: { name: "asc" },
    take: 6,
  });

  const formatted = shelters.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    verified: s.verified,
    isDemo: s.isDemo,
    dataSourceType: s.dataSourceType as any,
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
    <section id="barinaklar" className="bg-stone-100 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Barınaklar"
          title="Yerel barınaklar tek merkezde."
          description="Her barınakta kaç dostun yeni yuva beklediğini gör, doğrulanmış profillerden iletişime geç."
        />
        <div className="mt-10">
          <ShelterGrid shelters={formatted} />
        </div>
      </div>
    </section>
  );
}
