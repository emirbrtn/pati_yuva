"use client";

import { useState, useEffect } from "react";
import {
  ageGroupList,
  speciesOptions,
  genderOptions,
} from "@/lib/filter-options";
import { animalTraitList, healthFieldList, healthFieldMeta } from "@/lib/status";
import { emptyFilters, isFiltersEmpty, type FiltersState } from "@/lib/filters";

type FilterOption = { id: string; name: string };

type FilterPanelProps = {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  cities?: string[];
  districts?: string[];
  shelterOptions?: FilterOption[];
};

const fieldClass =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-700 outline-none focus:border-emerald-700";

export function FilterPanel({
  value,
  onChange,
  cities: citiesProp,
  districts: districtsProp,
  shelterOptions: shelterOptionsProp,
}: FilterPanelProps) {
  const [cities, setCities] = useState<string[]>(citiesProp ?? []);
  const [districts, setDistricts] = useState<string[]>(districtsProp ?? []);
  const [shelterOptions, setShelterOptions] = useState<FilterOption[]>(shelterOptionsProp ?? []);

  // İlk yüklemede verileri çek
  useEffect(() => {
    if (citiesProp && citiesProp.length > 0) return;
    fetch("/api/filters")
      .then((r) => r.json())
      .then((data: { cities?: string[]; shelterOptions?: FilterOption[] }) => {
        if (data.cities) setCities(data.cities);
        if (data.shelterOptions) setShelterOptions(data.shelterOptions);
      })
      .catch(() => {});
  }, [citiesProp]);

  // Şehir değişince ilçeleri çek
  useEffect(() => {
    if (!value.city) {
      setDistricts([]);
      return;
    }
    if (districtsProp && districtsProp.length > 0 && value.city) return;
    fetch(`/api/filters?city=${encodeURIComponent(value.city)}`)
      .then((r) => r.json())
      .then((data: { districts?: string[] }) => {
        if (data.districts) setDistricts(data.districts);
      })
      .catch(() => {});
  }, [value.city, districtsProp]);

  const update = (patch: Partial<FiltersState>) => onChange({ ...value, ...patch });

  const toggleTrait = (trait: (typeof animalTraitList)[number]) => {
    const next = value.traits.includes(trait)
      ? value.traits.filter((t) => t !== trait)
      : [...value.traits, trait];
    update({ traits: next });
  };

  const toggleHealth = (field: (typeof healthFieldList)[number]) => {
    const next = value.healthFields.includes(field)
      ? value.healthFields.filter((f) => f !== field)
      : [...value.healthFields, field];
    update({ healthFields: next });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-950">Filtreler</h2>
        <button
          type="button"
          onClick={() => onChange(emptyFilters)}
          disabled={isFiltersEmpty(value)}
          className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Temizle
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">Tür</p>
        <div className="flex flex-wrap gap-2">
          {speciesOptions.map((species) => (
            <button
              key={species}
              type="button"
              onClick={() => update({ species: value.species === species ? "" : species })}
              aria-pressed={value.species === species}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                value.species === species
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-800"
              }`}
            >
              {species}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">Cinsiyet</p>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => update({ gender: value.gender === gender ? "" : gender })}
              aria-pressed={value.gender === gender}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                value.gender === gender
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-800"
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">Yaş</p>
        <div className="flex flex-wrap gap-2">
          {ageGroupList.map((ageGroup) => (
            <button
              key={ageGroup}
              type="button"
              onClick={() => update({ ageGroup: value.ageGroup === ageGroup ? "" : ageGroup })}
              aria-pressed={value.ageGroup === ageGroup}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                value.ageGroup === ageGroup
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-800"
              }`}
            >
              {ageGroup}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">Şehir</p>
        <select
          value={value.city}
          onChange={(event) =>
            update({ city: event.target.value, district: "" })
          }
          className={fieldClass}
        >
          <option value="">Tüm şehirler</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">İlçe</p>
        <select
          value={value.district}
          onChange={(event) => update({ district: event.target.value })}
          disabled={!value.city || districts.length === 0}
          className={fieldClass}
        >
          <option value="">Tüm ilçeler</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">Barınak</p>
        <select
          value={value.shelterId}
          onChange={(event) => update({ shelterId: event.target.value })}
          className={fieldClass}
        >
          <option value="">Tüm barınaklar</option>
          {shelterOptions.map((shelter) => (
            <option key={shelter.id} value={shelter.id}>
              {shelter.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">Özellikler</p>
        <div className="space-y-2">
          {animalTraitList.map((trait) => (
            <label key={trait} className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={value.traits.includes(trait)}
                onChange={() => toggleTrait(trait)}
                className="h-4 w-4 rounded border-stone-300 accent-emerald-700"
              />
              {trait}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-stone-800">Sağlık</p>
        <div className="space-y-2">
          {healthFieldList.map((field) => (
            <label key={field} className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={value.healthFields.includes(field)}
                onChange={() => toggleHealth(field)}
                className="h-4 w-4 rounded border-stone-300 accent-emerald-700"
              />
              {healthFieldMeta[field].label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
