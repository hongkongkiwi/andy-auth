import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import type { EnhancedPrismaClient } from './types';
import { isDevelopment } from '@/lib/utils/env';
import { getServerSession } from '@/lib/auth/server';
import type { EnhanceOptions } from './types';
import { DatabaseError } from './types';

/**
 * Global type declarations for development hot reloading support
 * Prevents multiple client instances during development
 */
declare global {
  var prisma: EnhancedPrismaClient | undefined;
  var basePrisma: PrismaClient | undefined;
}

/**
 * Base Prisma client instance with logging configuration
 * Uses global instance in development to prevent connection issues
 */
const basePrisma =
  globalThis.basePrisma ??
  new PrismaClient({
    log: isDevelopment() ? ['error', 'warn'] : ['error']
  });

/**
 * Enhanced Prisma client with Zenstack features
 * Provides access control and audit logging capabilities
 */
const enhancedPrisma = enhance(basePrisma, {
  kinds: ['policy', 'password'],
  logPrismaQuery: isDevelopment(),
  errorTransformer: (error: Error) =>
    new DatabaseError('Custom error message', error)
}) as EnhancedPrismaClient;

// Development hot reloading support
if (isDevelopment()) {
  globalThis.basePrisma = basePrisma;
  globalThis.prisma = enhancedPrisma;
}

/**
 * Default enhanced client for direct database access
 * Use this when you don't need user context or retries
 */
export const prisma = enhancedPrisma;

/**
 * Get a fresh enhanced client instance
 * Useful when you need a clean client without existing context
 */
export const getBaseEnhancedPrisma = (options: EnhanceOptions = {}) => {
  const enhanced = enhance(basePrisma, {
    ...options,
    kinds: ['policy', 'password']
  });
  return enhanced as EnhancedPrismaClient;
};

/**
 * Get the raw Prisma client without enhancements
 * Use this when you need direct database access without Zenstack features
 */
export const getBasePrisma = () => basePrisma;

/**
 * Gracefully disconnect from the database
 * Important for proper cleanup and resource management
 */
export const disconnect = async () => {
  await basePrisma.$disconnect();
};

// Cleanup handler for development
if (isDevelopment()) {
  process.on('beforeExit', disconnect);
}

/**
 * Get a protected database client with user context
 */
export const getProtectedDb = async () => {
  const session = await getServerSession();
  const userId = session?.user?.id || 'anonymous';

  return getBaseEnhancedPrisma({
    user: { id: userId }
  });
};
