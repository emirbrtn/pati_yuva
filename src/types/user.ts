export type UserRole =
  | "USER"
  | "SHELTER_ADMIN"
  | "MUNICIPALITY_ADMIN"
  | "MODERATOR"
  | "SUPER_ADMIN";

export const userRoleLabels: Record<UserRole, string> = {
  USER: "Kullanıcı",
  SHELTER_ADMIN: "Barınak Yetkilisi",
  MUNICIPALITY_ADMIN: "Belediye Yöneticisi",
  MODERATOR: "Moderatör",
  SUPER_ADMIN: "Süper Yönetici",
};

export type User = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export const ROLE_NAMES = Object.keys(userRoleLabels) as UserRole[];
