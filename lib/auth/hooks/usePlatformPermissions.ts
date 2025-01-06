import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissions } from './usePermissions';

export const usePlatformPermissions = () => {
  const { checkPermission } = usePermissions();

  const canManageUsers = useCallback(async () => {
    return checkPermission(PermissionType.PLATFORM_ADMIN);
  }, [checkPermission]);

  const canManageWorkspaces = useCallback(async () => {
    return checkPermission(PermissionType.PLATFORM_ADMIN);
  }, [checkPermission]);

  const canViewAuditLogs = useCallback(async () => {
    return checkPermission(PermissionType.PLATFORM_ADMIN);
  }, [checkPermission]);

  const canManageSettings = useCallback(async () => {
    return checkPermission(PermissionType.PLATFORM_ADMIN);
  }, [checkPermission]);

  const canAccessApi = useCallback(async () => {
    return checkPermission(PermissionType.PLATFORM_USER);
  }, [checkPermission]);

  return {
    canManageUsers,
    canManageWorkspaces,
    canViewAuditLogs,
    canManageSettings,
    canAccessApi
  };
};
