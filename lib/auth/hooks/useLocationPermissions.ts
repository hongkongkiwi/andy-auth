import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { usePermissionInheritance } from './usePermissionInheritance';

export const useLocationPermissions = (locationId: string) => {
  const { checkInheritedPermission } = usePermissionInheritance();

  const canManageDevices = useCallback(async () => {
    return checkInheritedPermission(PermissionType.LOCATION_ADMIN, locationId);
  }, [locationId, checkInheritedPermission]);

  const canManageGuards = useCallback(async () => {
    return checkInheritedPermission(PermissionType.LOCATION_ADMIN, locationId);
  }, [locationId, checkInheritedPermission]);

  const canViewIncidents = useCallback(async () => {
    return checkInheritedPermission(PermissionType.LOCATION_VIEWER, locationId);
  }, [locationId, checkInheritedPermission]);

  const canCreateIncidents = useCallback(async () => {
    return checkInheritedPermission(PermissionType.LOCATION_EDITOR, locationId);
  }, [locationId, checkInheritedPermission]);

  const canUpdateIncidents = useCallback(async () => {
    return checkInheritedPermission(PermissionType.LOCATION_EDITOR, locationId);
  }, [locationId, checkInheritedPermission]);

  return {
    canManageDevices,
    canManageGuards,
    canViewIncidents,
    canCreateIncidents,
    canUpdateIncidents
  };
};
