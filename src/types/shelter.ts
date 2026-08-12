export type Shelter = {
  id: string;
  slug: string;
  name: string;
  verified: boolean;
  isDemo: boolean;
  description: string;
  city: string;
  district: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  workingHours?: string;
  imageUrl?: string;
  officialSourceUrl?: string;
};
