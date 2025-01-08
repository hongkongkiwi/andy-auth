import { Prisma } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';
import type {
  TransactionCallback,
  TransactionFunction,
  TransactionOptions,
  EnhancedPrismaClient
} from './base-types';

export type { TransactionCallback, TransactionFunction, TransactionOptions };

// Interactive transaction with serializable isolation
export const interactiveTransaction = <T>(
  client: EnhancedPrismaClient,
  callback: TransactionCallback<T>,
  options?: TransactionOptions
): Promise<T> => {
  return client.$transaction(
    (tx) => callback(enhance(tx, { id: client.$enhanced.id })),
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      ...options
    }
  );
};

// Background transaction with repeatable read isolation
export const backgroundTransaction = <T>(
  client: EnhancedPrismaClient,
  callback: TransactionCallback<T>,
  options?: TransactionOptions
): Promise<T> => {
  return client.$transaction(
    (tx) => callback(enhance(tx, { id: client.$enhanced.id })),
    {
      isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
      ...options
    }
  );
};
