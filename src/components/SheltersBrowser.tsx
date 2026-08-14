"use client";

import { useMemo, useState } from "react";
import { ShelterGrid } from "@/components/ShelterGrid";
import { includesNormalized } from "@/lib/text";
import type { Shelter } from "@/types/shelter";

type SheltersBrowserProps = {
  shelters: Shelter[];
};

export function SheltersBrowser({ shelters }: SheltersBrowserProps) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const cities = useMemo(
    () => [...new Set(shelters.map((shelter) => shelter.city))].sort(),
    [shelters]
  );
  const districts = useMemo(
    () =>
      [
        ...new Set(
          shelters
            .filter((shelter) => !city || shelter.city === city)
            .map((shelter) => shelter.district)
            .filter(Boolean)
        ),
      ].sort(),
    [shelters, city]
  );

  const results = useMemo(() => {
    const query = search.trim();
    return shelters.filter((shelter) => {
      if (city && shelter.city !== city) return false;
      if (district && shelter.district !== district) return false;
      if (query) {
        const haystack = [
          shelter.name,
          shelter.city,
          shelter.district,
          shelter.description,
        ].join(" ");
        if (!includesNormalized(haystack, query)) return false;
      }
      return true;
    });
  }, [shelters, city, district, search]);

  const hasFilters = Boolean(search || city || district);
  const clearAll = () => {
    setSearch("");
    setCity("");
    setDistrict("");
  };

  const fieldClass =
    "h-11 rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-700 outline-none focus:border-emerald-700";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="sr-only" htmlFor="shelter-search">
          Barınaklarda ara
        </label>
        <input
          id="shelter-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Barınak veya şehir ara..."
          className={`${fieldClass} w-full`}
        />
        <select
          aria-label="Şehre göre filtrele"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            setDistrict("");
          }}
          className={`${fieldClass} w-full`}
        >
          <option value="">Tüm şehirler</option>
          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          aria-label="İlçeye göre filtrele"
          value={district}
          onChange={(event) => setDistrict(event.target.value)}
          disabled={!city || districts.length === 0}
          className={`${fieldClass} w-full disabled:opacity-50`}
        >
          <option value="">Tüm ilçeler</option>
          {districts.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {hasFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
          >
            Filtreleri Temizle
          </button>
        ) : null}
        <p className="ml-auto text-sm text-stone-600">
          <span className="font-semibold text-stone-950">{results.length}</span>{" "}
          {results.length === 1 ? "barınak listeleniyor" : "barınak listeleniyor"}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <p className="text-4xl" aria-hidden="true">
            🏠
          </p>
          <h2 className="mt-4 text-xl font-bold text-stone-950">
            Bu kriterlere uyan barınak bulunamadı.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
            Farklı bir filtre dene veya tüm barınakları listele.
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
        <ShelterGrid shelters={results} />
      )}
    </div>
  );
}
