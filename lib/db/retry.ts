import type {
  EnhancedPrismaClient,
  TransactionCallback,
  TransactionOptions,
  DbResult
} from './types';
import { createDatabaseError } from './errors';
import { DB_CONFIG, RetryableErrorCode } from './constants';
import { enhance } from '@zenstackhq/runtime';
import { Prisma } from '@prisma/client';

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxAttempts = DB_CONFIG.retry.maxAttempts
): Promise<T> => {
  let lastError: Error = new Error('Operation failed');
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (!isRetryableError(error) || attempt === maxAttempts) {
        throw createDatabaseError(error);
      }
      await sleep(getBackoffTime(attempt));
    }
  }
  throw lastError;
};

export const withRetryableTransaction = async <T>(
  client: EnhancedPrismaClient,
  fn: TransactionCallback<T>,
  options: TransactionOptions = {}
): Promise<T> => {
  return withRetry(async () => {
    return client.$transaction(
      (tx) => fn(enhance(tx, { id: client.$enhanced.id })),
      options
    );
  });
};

export const safeTransaction = async <T>(
  client: EnhancedPrismaClient,
  fn: TransactionCallback<T>,
  options: TransactionOptions = {}
): Promise<DbResult<T>> => {
  try {
    const result = await withRetryableTransaction(client, fn, options);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: createDatabaseError(error)
    };
  }
};

const isRetryableError = (error: unknown): boolean => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const retryableErrorCodes = [
      ...DB_CONFIG.retry.retryableErrors.connection,
      ...DB_CONFIG.retry.retryableErrors.transaction
    ];
    return retryableErrorCodes.includes(error.code as RetryableErrorCode);
  }
  return false;
};

const getBackoffTime = (attempt: number): number => {
  return Math.min(
    DB_CONFIG.retry.baseDelay * Math.pow(2, attempt - 1),
    DB_CONFIG.retry.maxDelay
  );
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
