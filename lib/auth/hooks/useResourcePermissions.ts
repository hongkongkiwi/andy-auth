import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissionInheritance } from './usePermissionInheritance';

export const useResourcePermissions = (resourceId: string) => {
  const { checkInheritedPermission } = usePermissionInheritance();

  const canView = useCallback(async () => {
    return (
      checkInheritedPermission(PermissionType.WORKSPACE_VIEWER, resourceId) ||
      checkInheritedPermission(PermissionType.CLIENT_VIEWER, resourceId) ||
      checkInheritedPermission(PermissionType.LOCATION_VIEWER, resourceId)
    );
  }, [resourceId, checkInheritedPermission]);

  const canEdit = useCallback(async () => {
    return (
      checkInheritedPermission(PermissionType.WORKSPACE_EDITOR, resourceId) ||
      checkInheritedPermission(PermissionType.CLIENT_EDITOR, resourceId) ||
      checkInheritedPermission(PermissionType.LOCATION_EDITOR, resourceId)
    );
  }, [resourceId, checkInheritedPermission]);

  const canAdmin = useCallback(async () => {
    return (
      checkInheritedPermission(PermissionType.WORKSPACE_ADMIN, resourceId) ||
      checkInheritedPermission(PermissionType.CLIENT_ADMIN, resourceId) ||
      checkInheritedPermission(PermissionType.LOCATION_ADMIN, resourceId)
    );
  }, [resourceId, checkInheritedPermission]);

  return {
    canView,
    canEdit,
    canAdmin
  };
};
