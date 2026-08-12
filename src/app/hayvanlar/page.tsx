import type { Metadata } from "next";
import { Suspense } from "react";
import { AnimalsBrowser } from "@/components/AnimalsBrowser";
import { getActiveAnimals } from "@/lib/relations";

export const metadata: Metadata = {
  title: "Hayvanları Keşfet | PatiYuva",
  description:
    "Türkiye'deki barınaklarda sahiplendirilmeyi bekleyen hayvanları keşfet; şehir, tür, yaş ve özelliklere göre filtrele.",
};

type AnimalsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AnimalsPage({ searchParams }: AnimalsPageProps) {
  const params = await searchParams;

  const query = new URLSearchParams();
  const fields = [
    "search",
    "species",
    "gender",
    "ageGroup",
    "city",
    "district",
    "shelterId",
  ] as const;
  for (const field of fields) {
    const raw = params[field];
    if (typeof raw === "string" && raw) query.set(field, raw);
  }
  const traits = params.traits;
  if (typeof traits === "string" && traits) query.set("traits", traits);
  const health = params.health;
  if (typeof health === "string" && health) query.set("health", health);

  return (
    <main className="bg-[#fffaf4]">
      <section className="border-b border-stone-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Hayvanları Keşfet
            </p>
            <h1 className="mt-3 text-4xl font-bold text-stone-950 sm:text-5xl">
              Yuva arayan dostlar.
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Barınaklardaki hayvanları filtrele, karakter ve sağlık bilgilerini
              incele, size uygun dostu bul.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <p className="py-10 text-center text-sm text-stone-500">
                Hayvanlar yükleniyor...
              </p>
            }
          >
            <AnimalsBrowser
              animals={getActiveAnimals()}
              initialParams={query.toString()}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}