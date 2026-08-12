import { Benefits } from "@/components/Benefits";
import { FeaturedAnimals } from "@/components/FeaturedAnimals";
import { HelpSection } from "@/components/HelpSection";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SearchFilters } from "@/components/SearchFilters";
import { ShelterShowcase } from "@/components/ShelterShowcase";

export default function Home() {
  return (
    <>
      <Hero />
      <HelpSection />
      <section className="border-y border-stone-200 bg-stone-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Arama
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-950 sm:text-4xl">
              Yaşamına uygun dostu bul.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">
              Şehir, tür, yaş ve cinsiyet seçerek filtrele, barınaklardan
              yuvana giden yola başla.
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <SearchFilters />
          </div>
        </div>
      </section>
      <FeaturedAnimals />
      <ShelterShowcase />
      <HowItWorks />
      <Benefits />
    </>
  );
}