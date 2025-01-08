import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import type {
  EnhancedPrismaClient,
  TransactionCallback,
  TransactionOptions,
  DbResult,
  RetryablePrismaMethod,
  EnhanceOptions
} from './types';
import { getServerSession } from '@/lib/auth/server';
import { getBaseEnhancedPrisma, getBasePrisma } from './client';
import { createDatabaseError } from './errors';
import { withRetry, withRetryableTransaction, safeTransaction } from './retry';
import { Prisma } from '@prisma/client';
import { DB_CONFIG } from './constants';

/**
 * Wrap a client with retry capabilities using a Proxy
 * Automatically retries failed operations based on error type
 *
 * @internal
 */
const wrapWithRetry = (client: EnhancedPrismaClient): EnhancedPrismaClient => {
  const handler: ProxyHandler<EnhancedPrismaClient> = {
    get(target, prop: string | symbol) {
      const value = target[prop as keyof EnhancedPrismaClient];
      if (
        typeof value === 'function' &&
        prop !== '$connect' &&
        prop !== '$disconnect' &&
        typeof prop === 'string' &&
        isPrismaMethod(prop)
      ) {
        const method = (value as Function).bind(target);
        return (...args: any[]) => withRetry(() => method(...args));
      }
      return value;
    }
  };
  return new Proxy(client, handler);
};

/**
 * Check if a property represents a retryable Prisma method
 * Excludes internal Prisma methods starting with $
 *
 * @internal
 */
const isPrismaMethod = (prop: string): prop is RetryablePrismaMethod => {
  return !prop.startsWith('$') && prop in getBasePrisma();
};

/**
 * Get a protected database client with user context and retry capabilities
 * @throws {DatabaseError} If session or enhancement fails
 */
export const getProtectedDb = async (
  withRetry = false
): Promise<EnhancedPrismaClient> => {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id || 'anonymous';

    const options: EnhanceOptions = {
      user: { id: userId }
    };

    const client = enhance(getBasePrisma(), options) as EnhancedPrismaClient;
    return withRetry ? wrapWithRetry(client) : client;
  } catch (error) {
    throw createDatabaseError(error);
  }
};

/**
 * Get an unprotected database client
 * @param withRetry Whether to wrap the client with retry capabilities
 * @returns Enhanced Prisma client
 */
export const getUnprotectedDb = (withRetry = false): EnhancedPrismaClient => {
  const client = getBaseEnhancedPrisma();
  return withRetry ? wrapWithRetry(client) : client;
};

/**
 * Get the raw Prisma client without any enhancements
 */
export const getRawDb = (): PrismaClient => {
  return getBasePrisma();
};

export {
  interactiveTransaction,
  backgroundTransaction
} from './transaction-types';

export {
  transaction,
  safeTransaction,
  safeInteractiveTransaction,
  safeBackgroundTransaction
} from './transaction';

export * from './types';
export * from './errors';
export * from './client';
