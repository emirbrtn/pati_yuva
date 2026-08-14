export type ShelterVerificationStatus =
  | "VERIFIED"
  | "PENDING_VERIFICATION"
  | "UNVERIFIED";

export type ShelterServiceName =
  | "sahiplendirme"
  | "veteriner"
  | "rehabilitasyon"
  | "acilMudahale";

export const shelterServiceLabels: Record<ShelterServiceName, string> = {
  sahiplendirme: "Sahiplendirme",
  veteriner: "Veteriner Hizmeti",
  rehabilitasyon: "Rehabilitasyon",
  acilMudahale: "Acil Müdahale",
};

export const shelterServiceList: ShelterServiceName[] = [
  "sahiplendirme",
  "veteriner",
  "rehabilitasyon",
  "acilMudahale",
];

export type Shelter = {
  id: string;
  slug: string;
  name: string;
  verified: boolean;
  isDemo: boolean;
  dataSourceType: "OFFICIAL" | "DEMO";
  verificationStatus: ShelterVerificationStatus;
  description: string;
  city: string;
  district: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  workingHours?: string;
  imageUrl?: string;
  images?: string[];
  municipalityId?: string;
  municipalityName?: string;
  contactUnit?: string;
  capacity?: number;
  services: ShelterServiceName[];
  latitude?: number;
  longitude?: number;
  officialSourceUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  lastVerifiedAt?: string;
  adminUserIds: string[];
  createdAt: string;
  updatedAt?: string;
};

export type ShelterReadModel = Shelter;