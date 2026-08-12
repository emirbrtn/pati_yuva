import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AdoptionApplication } from "@/types/adoption";
import type { User } from "@/types/user";

export type StoredUser = User & { passwordHash: string };

export type StoredSession = {
  token: string;
  userId: string;
  expiresAt: string;
};

export type StoredFavorite = {
  id: string;
  userId: string;
  animalId: string;
  createdAt: string;
};

export type StoredApplication = AdoptionApplication & {
  userId: string;
};

export type DbShape = {
  users: StoredUser[];
  sessions: StoredSession[];
  favorites: StoredFavorite[];
  applications: StoredApplication[];
};

export const DB_DIR = path.join(process.cwd(), "data");
export const DB_PATH = path.join(DB_DIR, "db.json");

function emptyDb(): DbShape {
  return {
    users: [],
    sessions: [],
    favorites: [],
    applications: [],
  };
}

let cache: DbShape | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function hydrate(raw: string): DbShape {
  const parsed = JSON.parse(raw) as Partial<DbShape>;
  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
    applications: Array.isArray(parsed.applications) ? parsed.applications : [],
  };
}

export async function readDb(): Promise<DbShape> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    cache = hydrate(raw);
  } catch {
    cache = emptyDb();
  }
  return cache;
}

async function persist(): Promise<void> {
  if (!cache) return;
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(cache, null, 2), "utf8");
}

export async function saveDb(): Promise<void> {
  writeQueue = writeQueue.then(persist);
  await writeQueue;
}

export function withId(): string {
  return randomUUID();
}

export function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}