import { PrismaClient, type Prisma } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import { auth } from '@/lib/auth';
import { PrismaClientWithRetry, prisma } from './client';
import { DB_RETRY_CONFIG } from './constants';

/**
 * Get Prisma client enhanced with user context for Zenstack
 * @returns Enhanced Prisma client with user context
 */
export const getDb = async () => {
  const session = await auth();
  return session?.user?.id
    ? enhance(prisma, { user: { id: session.user.id } })
    : prisma;
};

/**
 * Execute a transaction with retry capabilities
 * @param fn Transaction function
 * @param options Transaction options
 */
export const transaction = async <T>(
  fn: (
    tx: Omit<
      PrismaClient,
      '$transaction' | '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
    >
  ) => Promise<T>,
  options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel;
  }
): Promise<T> => {
  return prisma.withRetry(
    async () => (await prisma.$transaction(fn, options)) as T,
    {
      maxRetries: DB_RETRY_CONFIG.EXTENDED_MAX_RETRIES,
      delay: DB_RETRY_CONFIG.EXTENDED_DELAY
    }
  );
};

// Export everything needed
export { prisma, type PrismaClientWithRetry };
export * from './errors';
export * from './constants';
