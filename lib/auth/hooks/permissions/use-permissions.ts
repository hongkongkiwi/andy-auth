'use client';

import { useCallback } from 'react';
import { useWorkspacePermissions } from './use-workspace-permissions';
import { WorkspacePermissionType, ClientPermissionType } from '.prisma/client';
import { AUTH_ERRORS } from '../../errors';

export const usePermissions = (workspaceId: string, clientId?: string) => {
  const { hasWorkspacePermission, hasClientPermission, isLoading } =
    useWorkspacePermissions(workspaceId);

  const checkWorkspacePermissions = useCallback(
    (permissions: WorkspacePermissionType[]) => {
      if (!permissions.every(hasWorkspacePermission)) {
        throw AUTH_ERRORS.PERMISSION_DENIED;
      }
    },
    [hasWorkspacePermission]
  );

  const checkClientPermissions = useCallback(
    (permissions: ClientPermissionType[]) => {
      if (!permissions.every(hasClientPermission)) {
        throw AUTH_ERRORS.PERMISSION_DENIED;
      }
    },
    [hasClientPermission]
  );

  return {
    checkWorkspacePermissions,
    checkClientPermissions,
    isLoading
  };
};
