import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const keyLength = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, keyLength).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }

  const [, salt, originalHash] = parts;
  const derived = scryptSync(password, salt, keyLength).toString("hex");

  const a = Buffer.from(originalHash, "hex");
  const b = Buffer.from(derived, "hex");
  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

