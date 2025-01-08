import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../auth-context';
import { getProtectedDb } from '@/lib/db';
import type {
  PermissionCheck,
  RoleCheck,
  PermissionResult
} from '../types/permissions';

// Define a type for the database model operations
type ModelOperations = {
  findFirst: (args: { where: any; select: any }) => Promise<any>;
};

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const checkPermissionMutation = useMutation<
    PermissionResult,
    Error,
    PermissionCheck
  >({
    mutationFn: async (params) => {
      const db = await getProtectedDb();

      try {
        await (db[params.model] as any).findFirst({
          where: params.data || {},
          select: { id: true }
        });
        return { granted: true };
      } catch (error) {
        return {
          granted: false,
          reason: error instanceof Error ? error.message : 'Permission denied'
        };
      }
    }
  });

  const checkRoleMutation = useMutation<PermissionResult, Error, RoleCheck>({
    mutationFn: async (params) => {
      const db = await getProtectedDb();
      const member = await db.resourceMember.findFirst({
        where: {
          userId: user?.id,
          OR: [
            { workspaceId: params.resourceId },
            { clientId: params.resourceId },
            { patrolId: params.resourceId }
          ],
          role: params.role
        }
      });
      return {
        granted: !!member,
        reason: member ? undefined : 'Required role not found'
      };
    }
  });

  const check = useCallback(
    async (params: PermissionCheck) => {
      if (!isAuthenticated || !user?.id) {
        return { granted: false, reason: 'No user authenticated' };
      }
      return checkPermissionMutation.mutateAsync(params);
    },
    [isAuthenticated, user?.id, checkPermissionMutation]
  );

  const checkRole = useCallback(
    async (params: RoleCheck) => {
      if (!isAuthenticated || !user?.id) {
        return { granted: false, reason: 'No user authenticated' };
      }
      return checkRoleMutation.mutateAsync(params);
    },
    [isAuthenticated, user?.id, checkRoleMutation]
  );

  return {
    check,
    checkRole,
    isChecking:
      checkPermissionMutation.isPending || checkRoleMutation.isPending,
    error: checkPermissionMutation.error || checkRoleMutation.error
  };
};
