import { Prisma } from '@prisma/client';

/**
 * Database retry configuration constants
 * @property DEFAULT_MAX_RETRIES - Default number of retry attempts
 * @property DEFAULT_DELAY - Default base delay between retries (ms)
 * @property EXTENDED_MAX_RETRIES - Maximum retries for important operations
 * @property EXTENDED_DELAY - Extended delay for important operations (ms)
 * @property RETRY_CODES - Prisma error codes that trigger retries
 */
export const DB_RETRY_CONFIG = {
  DEFAULT_MAX_RETRIES: 3,
  DEFAULT_DELAY: 1000,
  EXTENDED_MAX_RETRIES: 5,
  EXTENDED_DELAY: 2000,
  RETRY_CODES: {
    CONNECTION: ['P1000', 'P1001', 'P1002'] as const,
    DEADLOCK: ['P2034'] as const
  }
} as const;

// Type definitions for Prisma error codes
export type PrismaErrorCode = Prisma.PrismaClientKnownRequestError['code'];
export type PrismaConnectionError = 'P1000' | 'P1001' | 'P1002';
export type PrismaDeadlockError = 'P2034';

export type DbRetryConfig = typeof DB_RETRY_CONFIG;
