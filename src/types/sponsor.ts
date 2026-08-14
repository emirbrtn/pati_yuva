export type SupportCategory =
  | "mama"
  | "tedavi"
  | "asi"
  | "kisirlastirma"
  | "ilac"
  | "bakim"
  | "barinak";

export const supportCategoryLabels: Record<SupportCategory, string> = {
  mama: "Mama",
  tedavi: "Tedavi",
  asi: "Aşı",
  kisirlastirma: "Kısırlaştırma",
  ilac: "İlaç",
  bakim: "Bakım",
  barinak: "Barınak İhtiyaçları",
};

export type CampaignStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED";

export type Campaign = {
  id: string;
  ownerId: string;
  ownerType: "SHELTER" | "MUNICIPALITY" | "USER";
  title: string;
  description: string;
  category: SupportCategory;
  targetAmount?: number;
  currentAmount: number;
  startDate?: string;
  endDate?: string;
  status: CampaignStatus;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  resultReport?: string;
  sponsorIds: string[];
  animalId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type Sponsor = {
  id: string;
  name: string;
  companyName?: string;
  email?: string;
  userId?: string;
  supportCategories: SupportCategory[];
  campaignIds: string[];
  createdAt: string;
};