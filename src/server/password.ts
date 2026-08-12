import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

function deriveKey(password: string, salt: string): Buffer {
  return scryptSync(password, salt, 64);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = deriveKey(password, salt).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  stored: string
): boolean {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;

  const candidate = deriveKey(password, salt);
  const expected = Buffer.from(hash, "hex");

  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  );
}