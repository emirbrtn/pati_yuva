import type { AnimalStatus, AnimalTrait, HealthField } from "@/types/animal";
import type { ApplicationStatus } from "@/types/adoption";

export const animalStatusMeta: Record<
  AnimalStatus,
  { label: string; badgeClass: string }
> = {
  AVAILABLE: {
    label: "Yuva Arıyor",
    badgeClass: "bg-emerald-50 text-emerald-800",
  },
  APPLICATION_PENDING: {
    label: "Başvuru Sürecinde",
    badgeClass: "bg-amber-100 text-amber-900",
  },
  ADOPTED: {
    label: "Yuva Buldu",
    badgeClass: "bg-stone-200 text-stone-700",
  },
  INACTIVE: {
    label: "Yayında Değil",
    badgeClass: "bg-stone-200 text-stone-600",
  },
};

export const animalStatusLabel = (status: AnimalStatus): string =>
  animalStatusMeta[status].label;

export const listingSourceLabel: Record<"SHELTER" | "USER", string> = {
  SHELTER: "Barınak",
  USER: "Bireysel İlan",
};

export const applicationStatusMeta: Record<
  ApplicationStatus,
  { badgeClass: string }
> = {
  Beklemede: { badgeClass: "bg-stone-100 text-stone-700" },
  İnceleniyor: { badgeClass: "bg-blue-100 text-blue-900" },
  "Görüşme Bekleniyor": { badgeClass: "bg-amber-100 text-amber-900" },
  Onaylandı: { badgeClass: "bg-emerald-50 text-emerald-800" },
  Reddedildi: { badgeClass: "bg-red-100 text-red-900" },
  Tamamlandı: { badgeClass: "bg-teal-100 text-teal-900" },
};

export const animalTraitList: AnimalTrait[] = [
  "Sakin",
  "Oyuncu",
  "Enerjik",
  "İnsanlarla Uyumlu",
  "Çocuklarla Uyumlu",
  "Diğer Hayvanlarla Uyumlu",
  "Ev Yaşamına Uygun",
];

export const healthFieldMeta: Record<
  HealthField,
  { label: string }
> = {
  vaccinated: { label: "Aşıları tamam" },
  neutered: { label: "Kısırlaştırılmış" },
  microchipped: { label: "Mikroçipli" },
  healthChecked: { label: "Sağlık kontrolü yapılmış" },
};

export const healthFieldList: HealthField[] = [
  "vaccinated",
  "neutered",
  "microchipped",
  "healthChecked",
];