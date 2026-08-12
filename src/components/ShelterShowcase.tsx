import { SectionHeader } from "@/components/SectionHeader";
import { ShelterGrid } from "@/components/ShelterGrid";
import { shelters } from "@/data/shelters";

export function ShelterShowcase() {
  const featured = shelters.slice(0, 6);

  return (
    <section id="barinaklar" className="bg-stone-100 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Barınaklar"
          title="Yerel barınaklar tek merkezde."
          description="Her barınakta kaç dostun yeni yuva beklediğini gör, doğrulanmış profillerden iletişime geç."
        />
        <div className="mt-10">
          <ShelterGrid shelters={featured} />
        </div>
      </div>
    </section>
  );
}