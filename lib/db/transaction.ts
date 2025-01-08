import { Prisma } from '@prisma/client';
import type {
  TransactionCallback,
  TransactionOptions,
  DbResult,
  TransactionClient,
  EnhancedPrismaClient
} from './types';
import { DB_CONFIG } from './constants';
import { withRetryableTransaction, safeTransaction as safeTx } from './retry';

export const transaction = async <T>(
  client: EnhancedPrismaClient,
  fn: TransactionCallback<T>,
  options: TransactionOptions = {}
): Promise<T> => {
  return withRetryableTransaction(client, fn, options);
};

export const interactiveTransaction = async <T>(
  client: EnhancedPrismaClient,
  fn: TransactionCallback<T>,
  options: TransactionOptions = {}
): Promise<T> => {
  return withRetryableTransaction(client, fn, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    timeout: DB_CONFIG.timeout.transaction * 2,
    maxWait: DB_CONFIG.timeout.transaction,
    ...options
  });
};

export const backgroundTransaction = async <T>(
  client: EnhancedPrismaClient,
  fn: TransactionCallback<T>,
  options: TransactionOptions = {}
): Promise<T> => {
  return withRetryableTransaction(client, fn, {
    isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
    timeout: DB_CONFIG.timeout.transaction,
    maxWait: DB_CONFIG.timeout.transaction / 2,
    ...options
  });
};

export const safeTransaction = safeTx;

export const safeInteractiveTransaction = async <T>(
  client: EnhancedPrismaClient,
  fn: TransactionCallback<T>,
  options: TransactionOptions = {}
): Promise<DbResult<T>> => {
  return safeTx(client, fn, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    timeout: DB_CONFIG.timeout.transaction * 2,
    maxWait: DB_CONFIG.timeout.transaction,
    ...options
  });
};

export const safeBackgroundTransaction = async <T>(
  client: EnhancedPrismaClient,
  fn: TransactionCallback<T>,
  options: TransactionOptions = {}
): Promise<DbResult<T>> => {
  return safeTx(client, fn, {
    isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
    timeout: DB_CONFIG.timeout.transaction,
    maxWait: DB_CONFIG.timeout.transaction / 2,
    ...options
  });
};
