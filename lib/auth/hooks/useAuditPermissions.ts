import { useCallback } from 'react';
import { PermissionType, AuditLogResourceType } from '@prisma/client';
import { usePermissions } from './usePermissions';
import { usePermissionInheritance } from './usePermissionInheritance';

export const useAuditPermissions = () => {
  const { checkPermission } = usePermissions();
  const { checkInheritedPermission } = usePermissionInheritance();

  const canViewAuditLogs = useCallback(
    async (resourceId?: string) => {
      // Platform admins can view all audit logs
      const isPlatformAdmin = await checkPermission(
        PermissionType.PLATFORM_ADMIN
      );
      if (isPlatformAdmin) return true;

      // Resource-specific audit log access
      if (resourceId) {
        return (
          (await checkInheritedPermission(
            PermissionType.WORKSPACE_ADMIN,
            resourceId
          )) ||
          (await checkInheritedPermission(
            PermissionType.CLIENT_ADMIN,
            resourceId
          )) ||
          (await checkInheritedPermission(
            PermissionType.LOCATION_ADMIN,
            resourceId
          ))
        );
      }

      return false;
    },
    [checkPermission, checkInheritedPermission]
  );

  const canExportAuditLogs = useCallback(
    async (resourceId?: string) => {
      return canViewAuditLogs(resourceId);
    },
    [canViewAuditLogs]
  );

  return {
    canViewAuditLogs,
    canExportAuditLogs
  };
};
