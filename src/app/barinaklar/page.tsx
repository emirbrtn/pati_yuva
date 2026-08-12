import type { Metadata } from "next";
import { SheltersBrowser } from "@/components/SheltersBrowser";
import { shelters } from "@/data/shelters";

export const metadata: Metadata = {
  title: "Barınaklar | PatiYuva",
  description:
    "Türkiye'deki barınakları keşfet; barınak adı, konum ve sahiplendirilebilir hayvan sayılarını gör.",
};

export default function SheltersPage() {
  return (
    <main className="bg-[#fffaf4]">
      <section className="border-b border-stone-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Barınaklar
            </p>
            <h1 className="mt-3 text-4xl font-bold text-stone-950 sm:text-5xl">
              Türkiye’deki barınaklar tek merkezde.
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
          <SheltersBrowser shelters={shelters} />
        </div>
      </section>
    </main>
  );
}