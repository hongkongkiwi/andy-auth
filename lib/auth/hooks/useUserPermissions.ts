import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissions } from './usePermissions';
import { useCachedPermissions } from './useCachedPermissions';

export const useUserPermissions = (userId: string) => {
  const { checkPermission } = usePermissions();
  const { checkCachedPermission } = useCachedPermissions();

  const getUserPermissions = useCallback(async () => {
    const response = await fetch(`/api/auth/users/${userId}/permissions`);
    if (!response.ok) {
      throw new Error('Failed to fetch user permissions');
    }
    return response.json();
  }, [userId]);

  const canManageUser = useCallback(async () => {
    // Platform admins can manage all users
    const isPlatformAdmin = await checkCachedPermission(
      PermissionType.PLATFORM_ADMIN
    );
    if (isPlatformAdmin) return true;

    // Workspace admins can manage users in their workspace
    const workspacePermissions = await getUserPermissions();
    return workspacePermissions.some(
      (p: any) => p.type === PermissionType.WORKSPACE_ADMIN
    );
  }, [userId, checkCachedPermission, getUserPermissions]);

  const canImpersonateUser = useCallback(async () => {
    return checkPermission(PermissionType.PLATFORM_ADMIN);
  }, [checkPermission]);

  return {
    getUserPermissions,
    canManageUser,
    canImpersonateUser
  };
};
