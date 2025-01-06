import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissions } from './usePermissions';

export const usePermissionInheritance = () => {
  const { checkPermission } = usePermissions();

  const getInheritedTypes = useCallback(
    (type: PermissionType): PermissionType[] => {
      switch (type) {
        case PermissionType.WORKSPACE_VIEWER:
          return [
            PermissionType.WORKSPACE_EDITOR,
            PermissionType.WORKSPACE_ADMIN
          ];
        case PermissionType.WORKSPACE_EDITOR:
          return [PermissionType.WORKSPACE_ADMIN];
        case PermissionType.CLIENT_VIEWER:
          return [
            PermissionType.CLIENT_EDITOR,
            PermissionType.CLIENT_ADMIN,
            PermissionType.WORKSPACE_ADMIN
          ];
        case PermissionType.CLIENT_EDITOR:
          return [PermissionType.CLIENT_ADMIN, PermissionType.WORKSPACE_ADMIN];
        case PermissionType.LOCATION_VIEWER:
          return [
            PermissionType.LOCATION_EDITOR,
            PermissionType.LOCATION_ADMIN,
            PermissionType.CLIENT_ADMIN,
            PermissionType.WORKSPACE_ADMIN
          ];
        case PermissionType.LOCATION_EDITOR:
          return [
            PermissionType.LOCATION_ADMIN,
            PermissionType.CLIENT_ADMIN,
            PermissionType.WORKSPACE_ADMIN
          ];
        default:
          return [];
      }
    },
    []
  );

  const checkInheritedPermission = useCallback(
    async (type: PermissionType, resourceId?: string) => {
      const types = [type, ...getInheritedTypes(type)];

      for (const permType of types) {
        const hasPermission = await checkPermission(permType, resourceId);
        if (hasPermission) return true;
      }

      return false;
    },
    [checkPermission, getInheritedTypes]
  );

  return {
    getInheritedTypes,
    checkInheritedPermission
  };
};
