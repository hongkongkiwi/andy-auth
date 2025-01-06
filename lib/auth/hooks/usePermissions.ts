import { useCallback } from 'react';
import { PermissionType } from '@prisma/client';
import { useAuth } from '../auth-context';

export const usePermissions = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const checkPermission = useCallback(
    async (type: PermissionType, resourceId?: string) => {
      if (!userId) return false;

      try {
        const response = await fetch('/api/auth/check-permission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type,
            resourceId
          })
        });

        if (!response.ok) return false;
        return true;
      } catch (error) {
        console.error('Permission check failed:', error);
        return false;
      }
    },
    [userId]
  );

  // Platform permissions
  const isPlatformAdmin = useCallback(async () => {
    return checkPermission(PermissionType.PLATFORM_ADMIN);
  }, [checkPermission]);

  const isPlatformUser = useCallback(async () => {
    return checkPermission(PermissionType.PLATFORM_USER);
  }, [checkPermission]);

  // Workspace permissions
  const isWorkspaceAdmin = useCallback(
    async (workspaceId: string) => {
      return checkPermission(PermissionType.WORKSPACE_ADMIN, workspaceId);
    },
    [checkPermission]
  );

  const isWorkspaceEditor = useCallback(
    async (workspaceId: string) => {
      return checkPermission(PermissionType.WORKSPACE_EDITOR, workspaceId);
    },
    [checkPermission]
  );

  const isWorkspaceViewer = useCallback(
    async (workspaceId: string) => {
      return checkPermission(PermissionType.WORKSPACE_VIEWER, workspaceId);
    },
    [checkPermission]
  );

  // Client permissions
  const isClientAdmin = useCallback(
    async (clientId: string) => {
      return checkPermission(PermissionType.CLIENT_ADMIN, clientId);
    },
    [checkPermission]
  );

  const isClientEditor = useCallback(
    async (clientId: string) => {
      return checkPermission(PermissionType.CLIENT_EDITOR, clientId);
    },
    [checkPermission]
  );

  const isClientViewer = useCallback(
    async (clientId: string) => {
      return checkPermission(PermissionType.CLIENT_VIEWER, clientId);
    },
    [checkPermission]
  );

  // Location permissions
  const isLocationAdmin = useCallback(
    async (locationId: string) => {
      return checkPermission(PermissionType.LOCATION_ADMIN, locationId);
    },
    [checkPermission]
  );

  const isLocationEditor = useCallback(
    async (locationId: string) => {
      return checkPermission(PermissionType.LOCATION_EDITOR, locationId);
    },
    [checkPermission]
  );

  const isLocationViewer = useCallback(
    async (locationId: string) => {
      return checkPermission(PermissionType.LOCATION_VIEWER, locationId);
    },
    [checkPermission]
  );

  return {
    checkPermission,
    // Platform
    isPlatformAdmin,
    isPlatformUser,
    // Workspace
    isWorkspaceAdmin,
    isWorkspaceEditor,
    isWorkspaceViewer,
    // Client
    isClientAdmin,
    isClientEditor,
    isClientViewer,
    // Location
    isLocationAdmin,
    isLocationEditor,
    isLocationViewer
  };
};
