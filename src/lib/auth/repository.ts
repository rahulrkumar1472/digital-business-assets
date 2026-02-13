import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { isPrismaReady, prisma } from "@/lib/db/prisma";

type FallbackUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

type FallbackSubscription = {
  id: string;
  userId: string;
  plan: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type FallbackStore = {
  users: FallbackUser[];
  subscriptions: FallbackSubscription[];
};

const storageFile = path.join(process.cwd(), ".data", "auth-store.json");

async function readFallbackStore(): Promise<FallbackStore> {
  try {
    const raw = await readFile(storageFile, "utf8");
    const parsed = JSON.parse(raw) as FallbackStore;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
    };
  } catch {
    return { users: [], subscriptions: [] };
  }
}

async function writeFallbackStore(store: FallbackStore) {
  await mkdir(path.dirname(storageFile), { recursive: true });
  await writeFile(storageFile, JSON.stringify(store, null, 2), "utf8");
}

export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();

  if (isPrismaReady()) {
    try {
      return await prisma.user.findUnique({
        where: { email: normalized },
      });
    } catch (error) {
      console.error("[auth-repository] prisma findUserByEmail failed, fallback to file", error);
    }
  }

  const store = await readFallbackStore();
  return store.users.find((user) => user.email === normalized) || null;
}

export async function findUserById(userId: string) {
  if (isPrismaReady()) {
    try {
      return await prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      console.error("[auth-repository] prisma findUserById failed, fallback to file", error);
    }
  }

  const store = await readFallbackStore();
  return store.users.find((user) => user.id === userId) || null;
}

export async function createUserWithSubscription(input: {
  email: string;
  passwordHash: string;
  plan: string;
}) {
  const normalized = input.email.trim().toLowerCase();
  const plan = input.plan.trim() || "Starter";

  if (isPrismaReady()) {
    try {
      return await prisma.user.create({
        data: {
          email: normalized,
          passwordHash: input.passwordHash,
          subscriptions: {
            create: {
              plan,
              status: "ACTIVE",
            },
          },
        },
        include: {
          subscriptions: true,
        },
      });
    } catch (error) {
      console.error("[auth-repository] prisma createUserWithSubscription failed, fallback to file", error);
    }
  }

  const store = await readFallbackStore();
  if (store.users.some((user) => user.email === normalized)) {
    throw new Error("An account with this email already exists.");
  }

  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const subscriptionId = crypto.randomUUID();
  const user: FallbackUser = {
    id: userId,
    email: normalized,
    passwordHash: input.passwordHash,
    createdAt: now,
    updatedAt: now,
  };
  const subscription: FallbackSubscription = {
    id: subscriptionId,
    userId,
    plan,
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };

  store.users.unshift(user);
  store.subscriptions.unshift(subscription);
  await writeFallbackStore(store);

  return {
    ...user,
    subscriptions: [subscription],
  };
}

export async function getUserSubscription(userId: string) {
  if (isPrismaReady()) {
    try {
      return await prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("[auth-repository] prisma getUserSubscription failed, fallback to file", error);
    }
  }

  const store = await readFallbackStore();
  const subscriptions = store.subscriptions
    .filter((item) => item.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return subscriptions[0] || null;
}

