import type { PrismaClient, Prisma } from '@prisma/client';
import type { EnhancementContext } from '@zenstackhq/runtime';
import type { enhance } from '@zenstackhq/runtime';

// Core client types
export interface BasePrismaClient extends Omit<PrismaClient, '$transaction'> {
  $transaction: {
    <T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T>;
    <T>(
      fn: (tx: TransactionClient) => Promise<T>,
      options: TransactionOptions
    ): Promise<T>;
  };
  check: (args: CheckArgs) => Promise<boolean>;
}

export type EnhancedPrismaClient = PrismaClient & {
  $enhanced: { id: string };
  $withAuth: (context: EnhanceContext) => EnhancedPrismaClient;
};

// Transaction types
export type TransactionClient = Omit<
  EnhancedPrismaClient,
  '$transaction' | '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
>;

export type TransactionCallback<T> = (tx: TransactionClient) => Promise<T>;

export interface TransactionOptions {
  maxWait?: number;
  timeout?: number;
  isolationLevel?: Prisma.TransactionIsolationLevel;
}

// Enhancement types
export type EnhanceContext = EnhancementContext<{ id: string }>;
export type EnhanceOptions = Parameters<typeof enhance>[1];

// Permission check types (from Zenstack docs)
export interface CheckArgs {
  model: string;
  operation: 'create' | 'read' | 'update' | 'delete';
  data?: Record<string, unknown>;
  user?: { id: string };
}

// Add TransactionFunction type
export type TransactionFunction = <T>(
  client: EnhancedPrismaClient,
  callback: TransactionCallback<T>,
  options?: TransactionOptions
) => Promise<T>;
