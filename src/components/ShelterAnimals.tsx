"use client";

import { useMemo, useState } from "react";
import { AnimalGrid } from "@/components/AnimalGrid";
import type {
  AgeGroup,
  Animal,
  AnimalGender,
  AnimalSpecies,
} from "@/types/animal";

type ShelterAnimalsProps = {
  animals: Animal[];
};

type Pills = {
  species: string;
  ageGroup: string;
  gender: string;
};

export function ShelterAnimals({ animals }: ShelterAnimalsProps) {
  const [pills, setPills] = useState<Pills>({
    species: "",
    ageGroup: "",
    gender: "",
  });

  const speciesOptions: AnimalSpecies[] = ["Kedi", "Köpek", "Diğer"];
  const ageGroups: AgeGroup[] = ["Yavru", "Genç", "Yetişkin", "Yaşlı"];
  const genders: AnimalGender[] = ["Dişi", "Erkek"];

  const results = useMemo(() => {
    return animals.filter((animal) => {
      if (pills.species && animal.species !== pills.species) return false;
      if (pills.ageGroup && animal.ageGroup !== pills.ageGroup) return false;
      if (pills.gender && animal.gender !== pills.gender) return false;
      return true;
    });
  }, [animals, pills]);

  const renderPills = (
    label: string,
    active: string,
    options: string[],
    onChange: (value: string) => void
  ) => (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(active === option ? "" : option)}
          aria-pressed={active === option}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
            active === option
              ? "border-emerald-700 bg-emerald-700 text-white"
              : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700 hover:text-emerald-800"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const hasActive =
    pills.species || pills.ageGroup || pills.gender;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {renderPills("Tür:", pills.species, speciesOptions, (v) =>
          setPills((p) => ({ ...p, species: v }))
        )}
        {renderPills("Yaş:", pills.ageGroup, ageGroups, (v) =>
          setPills((p) => ({ ...p, ageGroup: v }))
        )}
        {renderPills("Cinsiyet:", pills.gender, genders, (v) =>
          setPills((p) => ({ ...p, gender: v }))
        )}
      </div>
      <p className="text-sm text-stone-600">
        <span className="font-semibold text-stone-950">{results.length}</span>{" "}
        {results.length === 1 ? "dost" : "dost"} listeleniyor
        {hasActive ? (
          <button
            type="button"
            onClick={() => setPills({ species: "", ageGroup: "", gender: "" })}
            className="ml-3 font-semibold text-emerald-800 hover:text-emerald-950"
          >
            Filtreleri temizle
          </button>
        ) : null}
      </p>
      <AnimalGrid animals={results} />
    </div>
  );
}