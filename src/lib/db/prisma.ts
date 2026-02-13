import { PrismaClient } from "@prisma/client";

declare global {
  var __dbaPrismaClient__: PrismaClient | undefined;
}

function buildClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = global.__dbaPrismaClient__ ?? buildClient();

if (process.env.NODE_ENV !== "production") {
  global.__dbaPrismaClient__ = prisma;
}

export function isPrismaReady() {
  return Boolean(process.env.DATABASE_URL);
}
