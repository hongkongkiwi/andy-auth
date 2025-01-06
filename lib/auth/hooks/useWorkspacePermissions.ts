import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissionInheritance } from './usePermissionInheritance';

export const useWorkspacePermissions = (workspaceId: string) => {
  const { checkInheritedPermission } = usePermissionInheritance();

  const canManageClients = useCallback(async () => {
    return checkInheritedPermission(
      PermissionType.WORKSPACE_ADMIN,
      workspaceId
    );
  }, [workspaceId, checkInheritedPermission]);

  const canManageUsers = useCallback(async () => {
    return checkInheritedPermission(
      PermissionType.WORKSPACE_ADMIN,
      workspaceId
    );
  }, [workspaceId, checkInheritedPermission]);

  const canManageSettings = useCallback(async () => {
    return checkInheritedPermission(
      PermissionType.WORKSPACE_ADMIN,
      workspaceId
    );
  }, [workspaceId, checkInheritedPermission]);

  const canViewAnalytics = useCallback(async () => {
    return checkInheritedPermission(
      PermissionType.WORKSPACE_VIEWER,
      workspaceId
    );
  }, [workspaceId, checkInheritedPermission]);

  return {
    canManageClients,
    canManageUsers,
    canManageSettings,
    canViewAnalytics
  };
};
