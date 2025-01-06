import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissions } from './usePermissions';

interface AssignPermissionParams {
  userId: string;
  type: PermissionType;
  resourceId?: string;
}

interface RemovePermissionParams {
  userId: string;
  type: PermissionType;
  resourceId?: string;
}

export const usePermissionManagement = () => {
  const { checkPermission } = usePermissions();

  const canManagePermissions = useCallback(
    async (resourceId?: string) => {
      if (!resourceId) {
        return checkPermission(PermissionType.PLATFORM_ADMIN);
      }
      return (
        checkPermission(PermissionType.WORKSPACE_ADMIN, resourceId) ||
        checkPermission(PermissionType.CLIENT_ADMIN, resourceId) ||
        checkPermission(PermissionType.LOCATION_ADMIN, resourceId)
      );
    },
    [checkPermission]
  );

  const assignPermission = useCallback(
    async (params: AssignPermissionParams) => {
      if (!(await canManagePermissions(params.resourceId))) {
        throw new Error('Insufficient permissions to assign permissions');
      }

      const response = await fetch('/api/auth/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Failed to assign permission');
      }
    },
    [canManagePermissions]
  );

  const removePermission = useCallback(
    async (params: RemovePermissionParams) => {
      if (!(await canManagePermissions(params.resourceId))) {
        throw new Error('Insufficient permissions to remove permissions');
      }

      const response = await fetch('/api/auth/permissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Failed to remove permission');
      }
    },
    [canManagePermissions]
  );

  return {
    canManagePermissions,
    assignPermission,
    removePermission
  };
};
