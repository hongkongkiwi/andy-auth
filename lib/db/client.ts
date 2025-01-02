import { PrismaClient } from '@prisma/client';
import { DB_RETRY_CONFIG } from './constants';
import {
  DbError,
  DbErrorCode,
  isRetryableError,
  mapPrismaError
} from './errors';

export const prismaBase = new PrismaClient();

const prismaClientWithRetry = prismaBase.$extends({
  client: {
    async withRetry<T>(
      fn: () => Promise<T>,
      maxRetries = DB_RETRY_CONFIG.EXTENDED_MAX_RETRIES
    ): Promise<T> {
      let lastError: Error | undefined;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          if (!isRetryableError(lastError)) {
            throw mapPrismaError(lastError);
          }

          if (attempt === maxRetries) {
            throw new DbError(DbErrorCode.MAX_RETRIES_EXCEEDED, {
              attempts: attempt,
              maxRetries
            });
          }

          await new Promise((resolve) =>
            setTimeout(resolve, DB_RETRY_CONFIG.EXTENDED_DELAY * attempt)
          );
        }
      }

      throw new DbError(DbErrorCode.OPERATION_FAILED, {
        error: lastError?.message
      });
    }
  }
});

type PrismaClientWithRetry = typeof prismaClientWithRetry;

declare global {
  var prisma: PrismaClientWithRetry | undefined;
}

export { prismaClientWithRetry as prisma };
if (process.env.NODE_ENV !== 'production')
  globalThis.prisma = prismaClientWithRetry;
