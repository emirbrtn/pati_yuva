import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { FavoriteButton } from "@/components/FavoriteButton";
import { SourceBadge, StatusBadge } from "@/components/StatusBadge";
import { getShelterNameById } from "@/lib/relations";
import type { Animal } from "@/types/animal";

type AnimalCardProps = {
  animal: Animal;
};

export function AnimalCard({ animal }: AnimalCardProps) {
  const shelterName = getShelterNameById(animal.shelterId);
  const location = animal.district
    ? `${animal.district}, ${animal.city}`
    : animal.city;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={`/hayvanlar/${animal.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={`${animal.name} detaylarını gör`}
      >
        <Image
          src={animal.imageUrls[0]}
          alt={`${animal.name} adlı ${animal.species.toLocaleLowerCase("tr")}`}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-stone-950">
                {animal.name}
              </h3>
              <StatusBadge status={animal.status} />
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {animal.species} • {animal.age} • {animal.gender}
            </p>
          </div>
          <FavoriteButton animalId={animal.id} />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-stone-800">
            📍 {location}
          </p>
          <p className="truncate text-sm text-stone-500">{shelterName}</p>
          <div className="flex items-center gap-2">
            <SourceBadge source={animal.sourceType} />
            {animal.breed ? (
              <span className="text-xs text-stone-400">{animal.breed}</span>
            ) : null}
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-stone-600">
          {animal.character}
        </p>
        <div className="mt-auto pt-1">
          <ButtonLink href={`/hayvanlar/${animal.slug}`} variant="secondary">
            Detayları Gör
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}