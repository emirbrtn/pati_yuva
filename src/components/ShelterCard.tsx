"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import type { Shelter } from "@/types/shelter";

type ShelterCardProps = {
  shelter: Shelter;
  stats?: { total: number; cats: number; dogs: number; others: number };
};

export function ShelterCard({ shelter, stats }: ShelterCardProps) {
  const s = stats ?? { total: 0, cats: 0, dogs: 0, others: 0 };
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={`/barinaklar/${shelter.slug}`}
        className="relative block aspect-[16/9] overflow-hidden"
        aria-label={`${shelter.name} barınağını gör`}
      >
        {shelter.imageUrl ? (
          <Image
            src={shelter.imageUrl}
            alt={shelter.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-14 w-14 text-emerald-700"
              aria-hidden="true"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold">{shelter.name}</h3>
          {shelter.isDemo ? (
            <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600">
              Demo Profil
            </span>
          ) : shelter.verified ? (
            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
              Doğrulanmış Barınak
            </span>
          ) : null}
        </div>
        <p className="text-sm font-medium text-stone-800">
          {shelter.district}, {shelter.city}
        </p>
        <p className="line-clamp-3 text-sm leading-6 text-stone-600">
          {shelter.description}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-stone-700">
          <span className="rounded-full bg-stone-100 px-3 py-1">
            {s.total} sahiplendirilebilir hayvan
          </span>
          {s.cats > 0 ? (
            <span className="rounded-full bg-stone-100 px-3 py-1">
              {s.cats} kedi
            </span>
          ) : null}
          {s.dogs > 0 ? (
            <span className="rounded-full bg-stone-100 px-3 py-1">
              {s.dogs} köpek
            </span>
          ) : null}
        </div>
        <div className="mt-auto pt-1">
          <ButtonLink href={`/barinaklar/${shelter.slug}`} variant="secondary">
            Barınağı Gör
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
