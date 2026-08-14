export type Municipality = {
  id: string;
  slug: string;
  name: string;
  city: string;
  district?: string;
  officialSourceUrl?: string;
  shelterIds: string[];
  adminUserIds: string[];
  createdAt: string;
  updatedAt?: string;
};