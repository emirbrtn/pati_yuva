export type NotificationType =
  | "APPLICATION_STATUS"
  | "ANIMAL_STATUS"
  | "SYSTEM"
  | "MODERATION";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt: string;
};