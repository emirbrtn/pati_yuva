export type AnimalSpecies = "Kedi" | "Köpek" | "Diğer";

export type AnimalGender = "Dişi" | "Erkek";

export type AgeGroup = "Yavru" | "Genç" | "Yetişkin" | "Yaşlı";

export type AnimalStatus =
  | "AVAILABLE"
  | "APPLICATION_PENDING"
  | "ADOPTED"
  | "INACTIVE";

export type ListingSource = "SHELTER" | "USER";

export type AnimalTrait =
  | "Sakin"
  | "Oyuncu"
  | "Enerjik"
  | "İnsanlarla Uyumlu"
  | "Çocuklarla Uyumlu"
  | "Diğer Hayvanlarla Uyumlu"
  | "Ev Yaşamına Uygun";

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
  ageGroup: AgeGroup;
  gender: AnimalGender;
  city: string;
  district?: string;
  shelterId?: string;
  ownerName?: string;
  sourceType: ListingSource;
  status: AnimalStatus;
  character: string;
  description: string;
  healthDescription?: string;
  traits: AnimalTrait[];
  health: HealthInfo;
  imageUrls: string[];
  createdAt: string;
  updatedAt?: string;
  isDemo?: boolean;
};