import { enhance } from '@zenstackhq/runtime';
import { prisma } from '@/lib/db/client';
import type { EnhanceContext } from '@/lib/db/types';

/**
 * Get a Zenstack-enhanced Prisma client for a specific user
 * @param userId The ID of the user to enhance the client with
 * @returns Enhanced Prisma client with user context
 */
export const getEnhancedPrisma = (userId: string) => {
  return enhance(prisma, {
    user: { id: userId }
  } satisfies EnhanceContext);
};
