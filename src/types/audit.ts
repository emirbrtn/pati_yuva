export type AuditTargetType =
  | "ANIMAL"
  | "SHELTER"
  | "APPLICATION"
  | "USER"
  | "MUNICIPALITY"
  | "CAMPAIGN";

export type AuditAction =
  | "ANIMAL_CREATED"
  | "ANIMAL_UPDATED"
  | "ANIMAL_DELETED"
  | "ANIMAL_STATUS_CHANGED"
  | "APPLICATION_CREATED"
  | "APPLICATION_STATUS_CHANGED"
  | "SHELTER_CREATED"
  | "SHELTER_UPDATED"
  | "SHELTER_VERIFICATION_CHANGED"
  | "USER_ROLE_CHANGED"
  | "USER_DELETED"
  | "CAMPAIGN_CREATED"
  | "CAMPAIGN_UPDATED";

export type AuditLogEntry = {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  targetType: AuditTargetType;
  targetId: string;
  action: AuditAction;
  detail?: string;
  before?: unknown;
  after?: unknown;
  shelterId?: string;
  municipalityId?: string;
  createdAt: string;
};