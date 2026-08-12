import type { Animal, AnimalTrait, HealthField } from "@/types/animal";
import { getShelterNameById } from "@/lib/relations";
import { includesNormalized } from "@/lib/text";

export type FiltersState = {
  search: string;
  species: string;
  gender: string;
  ageGroup: string;
  city: string;
  district: string;
  shelterId: string;
  traits: AnimalTrait[];
  healthFields: HealthField[];
};

export const emptyFilters: FiltersState = {
  search: "",
  species: "",
  gender: "",
  ageGroup: "",
  city: "",
  district: "",
  shelterId: "",
  traits: [],
  healthFields: [],
};

export function isFiltersEmpty(filters: FiltersState): boolean {
  return (
    !filters.search &&
    !filters.species &&
    !filters.gender &&
    !filters.ageGroup &&
    !filters.city &&
    !filters.district &&
    !filters.shelterId &&
    filters.traits.length === 0 &&
    filters.healthFields.length === 0
  );
}

export function matchesFilters(animal: Animal, filters: FiltersState): boolean {
  const query = filters.search.trim();
  if (query) {
    const haystack = [
      animal.name,
      animal.species,
      animal.breed ?? "",
      animal.city,
      animal.district ?? "",
      getShelterNameById(animal.shelterId),
      animal.ownerName ?? "",
    ].join(" ");

    const terms = query.split(/\s+/);
    if (!terms.every((term) => includesNormalized(haystack, term))) {
      return false;
    }
  }

  if (filters.species && animal.species !== filters.species) return false;
  if (filters.gender && animal.gender !== filters.gender) return false;
  if (filters.ageGroup && animal.ageGroup !== filters.ageGroup) return false;
  if (filters.city && animal.city !== filters.city) return false;
  if (filters.district && animal.district !== filters.district) return false;
  if (filters.shelterId && animal.shelterId !== filters.shelterId) return false;

  if (filters.traits.length > 0) {
    const hasAll = filters.traits.every((trait) =>
      animal.traits.includes(trait)
    );
    if (!hasAll) return false;
  }

  if (filters.healthFields.length > 0) {
    const hasAll = filters.healthFields.every((field) => animal.health[field]);
    if (!hasAll) return false;
  }

  return true;
}

export function filterAnimals(
  animals: Animal[],
  filters: FiltersState
): Animal[] {
  return animals.filter((animal) => matchesFilters(animal, filters));
}