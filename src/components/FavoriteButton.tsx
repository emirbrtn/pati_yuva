"use client";

import { useFavorites } from "@/hooks/useFavorites";

type FavoriteButtonProps = {
  animalId: string;
  label?: string;
  className?: string;
};

export function FavoriteButton({
  animalId,
  label = "Favorilere ekle",
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(animalId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(animalId)}
      aria-pressed={active}
      aria-label={active ? "Favorilerden çıkar" : label}
      title={active ? "Favorilerden çıkar" : label}
      className={`inline-flex items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
        active
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-stone-200 bg-white text-stone-500 hover:border-red-200 hover:text-red-500"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}