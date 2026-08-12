"use client";

import Link from "next/link";
import { AnimalGrid } from "@/components/AnimalGrid";
import { useFavorites } from "@/hooks/useFavorites";
import { getActiveAnimals } from "@/lib/relations";

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const favoriteAnimals = getActiveAnimals().filter((animal) =>
    favoriteIds.includes(animal.id)
  );

  return (
    <main className="bg-[#fffaf4]">
      <section className="border-b border-stone-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Favorilerim
          </p>
          <h1 className="mt-3 text-4xl font-bold text-stone-950 sm:text-5xl">
            Kaydettiğin dostlar.
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-600">
            Kalp işaretiyle kaydettiğin hayvanları buradan hızlıca gözden
            geçirebilirsin.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {favoriteAnimals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <p className="text-4xl" aria-hidden="true">
                💚
              </p>
              <h2 className="mt-4 text-xl font-bold text-stone-950">
                Henüz favorin bulunmuyor.
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
                Hayvan kartlarındaki kalp ikonuna tıklayarak dostlarını favorilere
                ekleyebilirsin.
              </p>
              <Link
                href="/hayvanlar"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Hayvanları Keşfet
              </Link>
            </div>
          ) : (
            <AnimalGrid animals={favoriteAnimals} />
          )}
        </div>
      </section>
    </main>
  );
}