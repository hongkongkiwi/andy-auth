import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissions } from './usePermissions';

interface BatchPermissionCheck {
  type: PermissionType;
  resourceId?: string;
}

export const useBatchPermissions = () => {
  const { checkPermission } = usePermissions();

  const checkBatchPermissions = useCallback(
    async (
      checks: BatchPermissionCheck[]
    ): Promise<Record<string, boolean>> => {
      const results: Record<string, boolean> = {};

      await Promise.all(
        checks.map(async ({ type, resourceId }) => {
          const key = resourceId ? `${type}_${resourceId}` : type;
          results[key] = await checkPermission(type, resourceId);
        })
      );

      return results;
    },
    [checkPermission]
  );

  return { checkBatchPermissions };
};
