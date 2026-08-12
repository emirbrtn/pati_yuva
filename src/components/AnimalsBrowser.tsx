"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimalGrid } from "@/components/AnimalGrid";
import { FilterPanel } from "@/components/FilterPanel";
import { SearchBar } from "@/components/SearchBar";
import {
  emptyFilters,
  filterAnimals,
  type FiltersState,
} from "@/lib/filters";
import type { Animal } from "@/types/animal";

function parseFilters(params: URLSearchParams): FiltersState {
  return {
    search: params.get("search") ?? "",
    species: params.get("species") ?? "",
    gender: params.get("gender") ?? "",
    ageGroup: params.get("ageGroup") ?? "",
    city: params.get("city") ?? "",
    district: params.get("district") ?? "",
    shelterId: params.get("shelterId") ?? "",
    traits: (params.get("traits") ?? "").split(",").filter(Boolean) as FiltersState["traits"],
    healthFields: (params.get("health") ?? "")
      .split(",")
      .filter(Boolean) as FiltersState["healthFields"],
  };
}

function filtersToQuery(filters: FiltersState): string {
  const query = new URLSearchParams();
  const scalars = [
    "search",
    "species",
    "gender",
    "ageGroup",
    "city",
    "district",
    "shelterId",
  ] as const;
  for (const key of scalars) {
    const value = filters[key];
    if (value) query.set(key, value);
  }
  if (filters.traits.length > 0) query.set("traits", filters.traits.join(","));
  if (filters.healthFields.length > 0)
    query.set("health", filters.healthFields.join(","));
  return query.toString();
}

function activeCount(filters: FiltersState): number {
  return (
    (filters.search ? 1 : 0) +
    (filters.species ? 1 : 0) +
    (filters.gender ? 1 : 0) +
    (filters.ageGroup ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.district ? 1 : 0) +
    (filters.shelterId ? 1 : 0) +
    filters.traits.length +
    filters.healthFields.length
  );
}

type AnimalsBrowserProps = {
  animals: Animal[];
  initialParams?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  resultCount?: boolean;
};

export function AnimalsBrowser({
  animals,
  initialParams,
  showSearch = true,
  showFilters = true,
  resultCount = true,
}: AnimalsBrowserProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FiltersState>(() =>
    initialParams
      ? parseFilters(new URLSearchParams(initialParams))
      : parseFilters(searchParams)
  );
  const [urlRef, setUrlRef] = useState(() => initialParams ?? searchParams.toString());

  if (searchParams.toString() !== urlRef) {
    setUrlRef(searchParams.toString());
    setFilters(parseFilters(searchParams));
  }

  const [drawerOpen, setDrawerOpen] = useState(false);

  const results = useMemo(
    () => filterAnimals(animals, filters),
    [animals, filters]
  );

  const applyFilters = (next: FiltersState) => {
    setFilters(next);
    const query = filtersToQuery(next);
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const update = (patch: Partial<FiltersState>) =>
    applyFilters({ ...filters, ...patch });

  const clearAll = () => applyFilters(emptyFilters);

  const filterCount = activeCount(filters);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
      {showFilters ? (
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm lg:p-6">
            <FilterPanel value={filters} onChange={applyFilters} />
          </div>
        </aside>
      ) : null}

      <div className="min-w-0 space-y-6">
        {showSearch ? (
          <SearchBar
            value={filters.search}
            onChange={(search) => update({ search })}
          />
        ) : null}

        {showFilters ? (
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-900 transition hover:border-emerald-700 hover:text-emerald-800"
            >
              Filtrele
              {filterCount > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-xs font-bold text-white">
                  {filterCount}
                </span>
              ) : null}
            </button>
            {filterCount > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              >
                Temizle
              </button>
            ) : null}
          </div>
        ) : null}

        {drawerOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Filtreleri kapat"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-stone-950/40"
            />
            <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-950">Filtreler</h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-500 hover:border-stone-400"
                  aria-label="Kapat"
                >
                  ✕
                </button>
              </div>
              <FilterPanel value={filters} onChange={applyFilters} />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-8 min-h-11 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Sonuçları Gör ({results.length})
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          {resultCount ? (
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-950">{results.length}</span>{" "}
              {results.length === 1 ? "dost listeleniyor" : "dost listeleniyor"}
            </p>
          ) : (
            <span />
          )}
        </div>

        {results.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <p className="text-4xl" aria-hidden="true">
              🔍
            </p>
            <h2 className="mt-4 text-xl font-bold text-stone-950">
              Aradığın kriterlerde dost bulunamadı.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              Farklı bir arama terimi dene veya filtreleri temizleyerek tüm
              hayvanlara göz at.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <AnimalGrid animals={results} />
        )}
      </div>
    </div>
  );
}