import { enhance } from '@zenstackhq/runtime';
import type { TransactionClient } from '@/lib/db/types';
import { getProtectedDb, EnhancedPrismaClient } from '@/lib/db/index';

export enum Operation {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export const checkPermission = async (
  userId: string,
  operation: Operation,
  data?: Record<string, unknown>
): Promise<boolean> => {
  try {
    const db = await getProtectedDb();
    const enhancedDb = enhance(db, { user: { id: userId } });
    return await enhancedDb.model.$can({
      operation,
      data
    });
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};

export const checkTransactionPermission = async (
  userId: string,
  operation: Operation,
  data: Record<string, unknown> | undefined,
  tx: TransactionClient
): Promise<boolean> => {
  try {
    const enhancedTx = enhance(tx, { user: { id: userId } });
    return await enhancedTx.model.$can({
      operation,
      data
    });
  } catch (error) {
    console.error('Transaction permission check failed:', error);
    return false;
  }
};
