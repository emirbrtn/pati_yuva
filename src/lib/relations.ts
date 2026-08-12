import { animals } from "@/data/animals";
import { shelters as shelterList } from "@/data/shelters";
import type { Animal } from "@/types/animal";
import type { Shelter } from "@/types/shelter";

export const shelters: Shelter[] = shelterList;

export function getShelterById(id?: string): Shelter | undefined {
  if (!id) return undefined;
  return shelterList.find((shelter) => shelter.id === id);
}

export function getShelterBySlug(slug: string): Shelter | undefined {
  return shelterList.find((shelter) => shelter.slug === slug);
}

export function getShelterNameById(id?: string): string {
  return getShelterById(id)?.name ?? "Bireysel İlan";
}

export function getAnimalsByShelterId(shelterId: string): Animal[] {
  return animals.filter(
    (animal) =>
      animal.shelterId === shelterId && animal.status !== "ADOPTED"
  );
}

export function getActiveAnimals(): Animal[] {
  return animals.filter((animal) => animal.status !== "ADOPTED");
}

export function getShelterStats(shelterId: string): {
  total: number;
  cats: number;
  dogs: number;
  others: number;
} {
  const list = getAnimalsByShelterId(shelterId);
  return {
    total: list.length,
    cats: list.filter((animal) => animal.species === "Kedi").length,
    dogs: list.filter((animal) => animal.species === "Köpek").length,
    others: list.filter((animal) => animal.species === "Diğer").length,
  };
}

export function getCities(): string[] {
  return [...new Set(animals.map((animal) => animal.city))].sort();
}

export function getDistrictsForCity(city: string): string[] {
  return [
    ...new Set(
      animals
        .filter((animal) => animal.city === city)
        .map((animal) => animal.district)
        .filter((district): district is string => Boolean(district))
    ),
  ].sort();
}

export function getShelterOptions() {
  return shelterList.map((shelter) => ({
    id: shelter.id,
    name: shelter.name,
  }));
}