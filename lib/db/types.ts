import type { PrismaClient } from '@prisma/client';
import { DatabaseError } from './errors';
export { DatabaseError };

export type * from './base-types';

// Retry types
export type RetryableErrorCode =
  | 'P1000'
  | 'P1001'
  | 'P1002' // Connection errors
  | 'P2034' // Transaction deadlock
  | 'P2024'; // Query timeout

export type RetryablePrismaMethod = keyof {
  [K in keyof PrismaClient as PrismaClient[K] extends (
    ...args: any[]
  ) => Promise<unknown>
    ? K
    : never]: PrismaClient[K];
};

// Result types
export type DbResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: DatabaseError;
    };
