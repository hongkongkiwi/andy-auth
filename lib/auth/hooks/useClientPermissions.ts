import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissionInheritance } from './usePermissionInheritance';

export const useClientPermissions = (clientId: string) => {
  const { checkInheritedPermission } = usePermissionInheritance();

  const canManageLocations = useCallback(async () => {
    return checkInheritedPermission(PermissionType.CLIENT_ADMIN, clientId);
  }, [clientId, checkInheritedPermission]);

  const canManageIncidents = useCallback(async () => {
    return checkInheritedPermission(PermissionType.CLIENT_EDITOR, clientId);
  }, [clientId, checkInheritedPermission]);

  const canViewReports = useCallback(async () => {
    return checkInheritedPermission(PermissionType.CLIENT_VIEWER, clientId);
  }, [clientId, checkInheritedPermission]);

  const canAssignTasks = useCallback(async () => {
    return checkInheritedPermission(PermissionType.CLIENT_EDITOR, clientId);
  }, [clientId, checkInheritedPermission]);

  return {
    canManageLocations,
    canManageIncidents,
    canViewReports,
    canAssignTasks
  };
};
