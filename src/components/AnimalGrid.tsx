import { AnimalCard } from "@/components/AnimalCard";
import type { Animal } from "@/types/animal";

type AnimalGridProps = {
  animals: Animal[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export function AnimalGrid({
  animals,
  emptyTitle = "Bu filtrelere uygun bir dost bulamadık.",
  emptyDescription = "Filtreleri gevşeterek veya arama terimini değiştirerek tekrar deneyebilirsin.",
}: AnimalGridProps) {
  if (animals.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <p className="text-4xl" aria-hidden="true">
          🐾
        </p>
        <h3 className="mt-4 text-xl font-bold text-stone-950">{emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {animals.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
}