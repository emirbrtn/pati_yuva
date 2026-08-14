export type AnimalSpecies = "Kedi" | "Köpek" | "Diğer";

export type AnimalGender = "Dişi" | "Erkek";

export type AgeGroup = "Yavru" | "Genç" | "Yetişkin" | "Yaşlı";

export type AnimalSize = "Küçük" | "Orta" | "Büyük";

export type EnergyLevel = "Düşük" | "Orta" | "Yüksek";

export type AnimalStatus =
  | "AVAILABLE"
  | "PENDING"
  | "ADOPTED"
  | "NOT_AVAILABLE"
  | "UNDER_TREATMENT";

export const animalStatusLabels: Record<AnimalStatus, string> = {
  AVAILABLE: "Yuva Arıyor",
  PENDING: "Başvuru Sürecinde",
  ADOPTED: "Yuva Buldu",
  NOT_AVAILABLE: "Şu An Sahiplendirilemez",
  UNDER_TREATMENT: "Tedavide",
};

export type ListingSource = "SHELTER" | "USER";

export type DataSourceType = "OFFICIAL" | "DEMO";

export type AnimalTrait =
  | "Sakin"
  | "Oyuncu"
  | "Enerjik"
  | "İnsanlarla Uyumlu"
  | "Çocuklarla Uyumlu"
  | "Diğer Hayvanlarla Uyumlu"
  | "Ev Yaşamına Uygun"
  | "Bahçeli Ev İster"
  | "Dış Mekânı Sever"
  | "Yetişkin Sahiplere Uygun";

export type HealthField =
  | "vaccinated"
  | "neutered"
  | "microchipped"
  | "healthChecked";

export type HealthInfo = {
  vaccinated: boolean | null;
  neutered: boolean | null;
  microchipped: boolean | null;
  healthChecked: boolean | null;
};

export type Animal = {
  id: string;
  slug: string;
  name: string;
  species: AnimalSpecies;
  breed?: string;
  age: string;
  birthDate?: string;
  ageGroup: AgeGroup;
  size: AnimalSize;
  gender: AnimalGender;
  color?: string;
  city: string;
  district?: string;
  shelterId?: string;
  ownerName?: string;
  sourceType: ListingSource;
  dataSourceType: DataSourceType;
  sourceUrl?: string;
  status: AnimalStatus;
  character: string;
  description: string;
  healthDescription?: string;
  energyLevel: EnergyLevel;
  specialNeeds?: string;
  goodWithChildren: boolean | null;
  goodWithDogs: boolean | null;
  goodWithCats: boolean | null;
  homeSuitable: boolean | null;
  gardenRequired: boolean | null;
  traits: AnimalTrait[];
  health: HealthInfo;
  microchipNumber?: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt?: string;
  lastVerifiedAt?: string;
  isDemo?: boolean;
};

export const animalStatusList: AnimalStatus[] = [
  "AVAILABLE",
  "PENDING",
  "ADOPTED",
  "NOT_AVAILABLE",
  "UNDER_TREATMENT",
];

export const animalSizeList: AnimalSize[] = ["Küçük", "Orta", "Büyük"];

export const energyLevelList: EnergyLevel[] = ["Düşük", "Orta", "Yüksek"];

export const animalSpeciesList: AnimalSpecies[] = ["Kedi", "Köpek", "Diğer"];