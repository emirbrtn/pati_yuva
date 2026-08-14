export type ApplicationStatus =
  | "PENDING"
  | "REVIEWING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  PENDING: "Beklemede",
  REVIEWING: "İnceleniyor",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
  COMPLETED: "Tamamlandı",
};

export const activeApplicationStatuses: ApplicationStatus[] = [
  "PENDING",
  "REVIEWING",
  "APPROVED",
];

export type HomeOwnership = "Ev Sahibi" | "Kiracı" | "Diğer";

export type AdoptionApplication = {
  id: string;
  animalId: string;
  animalName: string;
  shelterId?: string;
  userName: string;
  userEmail: string;
  phone: string;
  city: string;
  houseType: string;
  homeOwnership?: HomeOwnership;
  houseHold?: string;
  hasGarden: boolean;
  previousExperience: boolean;
  hasOtherPets: boolean;
  hasChildren?: boolean;
  dailyCareTime?: string;
  reason: string;
  needsCoverage?: string;
  vetCoverage?: string;
  shelterAccess?: string;
  availableTime?: string;
  note?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  animal?: {
    id: string;
    name: string;
    species: string;
    imageUrls: string[];
    slug: string;
    city: string;
    district?: string;
  };
  shelter?: {
    id: string;
    name: string;
    city: string;
  };
};