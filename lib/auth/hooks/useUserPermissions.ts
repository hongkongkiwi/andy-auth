import { useCallback } from 'react';
import { usePermissions } from './usePermissions';
import type { Role } from '@prisma/client';

export const useUserPermissions = (userId: string) => {
  const { check, checkRole } = usePermissions();

  const canManageUser = useCallback(async () => {
    const result = await check({
      model: 'user',
      operation: 'update',
      data: { id: userId }
    });
    return result.granted;
  }, [userId, check]);

  const hasRole = useCallback(
    async (role: Role) => {
      const result = await checkRole({
        role,
        resourceId: userId
      });
      return result.granted;
    },
    [userId, checkRole]
  );

  return {
    canManageUser,
    hasRole
  };
};
