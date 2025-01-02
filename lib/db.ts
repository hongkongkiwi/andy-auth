import { enhance } from '@zenstackhq/runtime';
import { auth } from '@/lib/auth';
import { PrismaClientWithRetry } from './db/client';

// Prevent multiple instances in development
declare global {
  var prisma: PrismaClientWithRetry | undefined;
}

export const prisma = globalThis.prisma || new PrismaClientWithRetry();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export const getDb = async () => {
  const session = await auth();

  if (!session?.user?.id) return prisma;

  return enhance(prisma, {
    user: { id: session.user.id }
  });
};

export type { PrismaClientWithRetry };
