import { ShelterCard } from "@/components/ShelterCard";
import type { Shelter } from "@/types/shelter";

type ShelterGridProps = {
  shelters: Shelter[];
};

export function ShelterGrid({ shelters }: ShelterGridProps) {
  if (shelters.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <p className="text-4xl" aria-hidden="true">
          🏠
        </p>
        <h3 className="mt-4 text-xl font-bold text-stone-950">
          Bu kritere uygun barınak bulamadık.
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
          Şehir filtresini değiştirerek tekrar deneyebilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {shelters.map((shelter) => (
        <ShelterCard key={shelter.id} shelter={shelter} />
      ))}
    </div>
  );
}