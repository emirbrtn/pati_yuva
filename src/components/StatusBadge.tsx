import { animalStatusMeta } from "@/lib/status";
import type { AnimalStatus, ListingSource } from "@/types/animal";

type StatusBadgeProps = {
  status: AnimalStatus;
  size?: "sm" | "md";
};

export function StatusBadge({
  status,
  size = "sm",
}: StatusBadgeProps) {
  const meta = animalStatusMeta[status];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${
        meta.badgeClass
      } ${
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
    >
      {meta.label}
    </span>
  );
}

type SourceBadgeProps = {
  source: ListingSource;
};

export function SourceBadge({ source }: SourceBadgeProps) {
  const isShelter = source === "SHELTER";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        isShelter
          ? "bg-emerald-50 text-emerald-800"
          : "bg-sky-50 text-sky-800"
      }`}
    >
      {isShelter ? "Barınak" : "Bireysel İlan"}
    </span>
  );
}