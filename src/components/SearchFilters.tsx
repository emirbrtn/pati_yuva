"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ageGroupList, genderOptions, speciesOptions } from "@/lib/filter-options";
import { getCities } from "@/lib/relations";

export function SearchFilters() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [species, setSpecies] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const cities = getCities();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (species) params.set("species", species);
    if (ageGroup) params.set("ageGroup", ageGroup);
    if (gender) params.set("gender", gender);
    router.push(`/hayvanlar${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const fieldClass =
    "h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-700 outline-none focus:border-emerald-700";

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="home-search" className="mb-2 block text-sm font-semibold text-stone-800">
            Arama
          </label>
          <input
            id="home-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Hayvan, şehir veya barınak ara..."
            className={fieldClass}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <label className="space-y-2 text-sm font-semibold text-stone-800">
            <span>Şehir</span>
            <select value={city} onChange={(event) => setCity(event.target.value)} className={fieldClass}>
              <option value="">Tüm şehirler</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-800">
            <span>Hayvan türü</span>
            <select value={species} onChange={(event) => setSpecies(event.target.value)} className={fieldClass}>
              <option value="">Tüm türler</option>
              {speciesOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-800">
            <span>Yaş grubu</span>
            <select value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)} className={fieldClass}>
              <option value="">Tüm yaşlar</option>
              {ageGroupList.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-800">
            <span>Cinsiyet</span>
            <select value={gender} onChange={(event) => setGender(event.target.value)} className={fieldClass}>
              <option value="">Tümü</option>
              {genderOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="min-h-11 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Hayvanları Keşfet
        </button>
        <Link
          href="/barinaklar"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-900 transition hover:border-emerald-700 hover:text-emerald-800"
        >
          Barınaklara Göz At
        </Link>
      </div>
    </form>
  );
}