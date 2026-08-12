import { AnimalGrid } from "@/components/AnimalGrid";
import { ButtonLink } from "@/components/ButtonLink";
import { SectionHeader } from "@/components/SectionHeader";
import { featuredAnimals } from "@/data/animals";

export function FeaturedAnimals() {
  return (
    <section className="bg-[#fffaf4] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Öne çıkan dostlar"
          title="Yuva arayan hayvanları yakından tanı."
          description="Her kartta temel bilgiler, barınak adı ve karakter özeti yer alır."
        />
        <div className="mt-10">
          <AnimalGrid animals={featuredAnimals} />
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
