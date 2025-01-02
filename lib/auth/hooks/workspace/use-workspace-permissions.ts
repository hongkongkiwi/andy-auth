'use client';

import { useCallback } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { WorkspacePermissionType, ClientPermissionType } from '.prisma/client';
import { AuthError, AuthErrorCode, AUTH_ERRORS } from '../../errors';
import type { Client } from '../types';

export interface UseWorkspacePermissionsReturn {
  hasWorkspacePermission: (permission: WorkspacePermissionType) => boolean;
  hasClientPermission: (permission: ClientPermissionType) => boolean;
  validatePermissions: () => void;
}

export const useWorkspacePermissions = (
  workspaceId: string
): UseWorkspacePermissionsReturn => {
  const { currentWorkspace, currentClient } = useAuthStore();

  const hasWorkspacePermission = useCallback(
    (permission: WorkspacePermissionType) => {
      return currentWorkspace?.permissions?.includes(permission) ?? false;
    },
    [currentWorkspace]
  );

  const hasClientPermission = useCallback(
    (permission: ClientPermissionType) => {
      return currentClient?.permissions?.includes(permission) ?? false;
    },
    [currentClient]
  );

  const validatePermissions = useCallback(() => {
    if (!hasWorkspacePermission(WorkspacePermissionType.READ)) {
      throw new AuthError(
        'Workspace access denied',
        AuthErrorCode.WORKSPACE_ACCESS_DENIED
      );
    }
  }, [hasWorkspacePermission]);

  return {
    hasWorkspacePermission,
    hasClientPermission,
    validatePermissions
  };
};
