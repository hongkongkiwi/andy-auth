import { useCallback } from 'react';
import { usePermissions } from './usePermissions';
import type { Role } from '@prisma/client';

export const useResourcePermissions = (
  resourceType: 'workspace' | 'client' | 'patrol',
  resourceId: string
) => {
  const { check, checkRole } = usePermissions();

  const canManage = useCallback(async () => {
    const result = await check({
      model: resourceType,
      operation: 'update',
      data: { id: resourceId }
    });
    return result.granted;
  }, [resourceType, resourceId, check]);

  const canManageMembers = useCallback(async () => {
    const result = await check({
      model: resourceType,
      operation: 'update',
      data: { id: resourceId, members: true }
    });
    return result.granted;
  }, [resourceType, resourceId, check]);

  const hasRole = useCallback(
    async (role: Role) => {
      const result = await checkRole({
        role,
        resourceId
      });
      return result.granted;
    },
    [resourceId, checkRole]
  );

  return {
    canManage,
    canManageMembers,
    hasRole
  };
};
