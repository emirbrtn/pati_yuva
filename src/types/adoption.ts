export type ApplicationStatus =
  | "Beklemede"
  | "İnceleniyor"
  | "Görüşme Bekleniyor"
  | "Onaylandı"
  | "Reddedildi"
  | "Tamamlandı";

export type AdoptionApplication = {
  id: string;
  animalId: string;
  animalName: string;
  userName: string;
  phone: string;
  email: string;
  city: string;
  houseType: string;
  hasGarden: boolean;
  previousExperience: boolean;
  hasOtherPets: boolean;
  reason: string;
  availableTime: string;
  note?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};