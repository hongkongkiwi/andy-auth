'use client';

import { useCallback, useState } from 'react';
import { useWorkspaceState } from './use-workspace-state';
import { useWorkspacePermissions } from './use-workspace-permissions';
import { WorkspaceStatus, WorkspacePermissionType } from '.prisma/client';
import { AuthError, AuthErrorCode } from '@/lib/auth/errors';
import type { Workspace } from '@/lib/auth/types';
import { toast } from 'sonner';
import { api } from '@/lib/trpc/client';

const fetchWorkspace = async (workspaceId: string): Promise<Workspace> => {
  const response = await api.Workspace.findMany.useQuery().data;
  const workspace = response?.find((w: { id: string }) => w.id === workspaceId);

  if (!workspace) {
    throw new AuthError(
      'Workspace not found',
      AuthErrorCode.WORKSPACE_ACCESS_DENIED
    );
  }

  return workspace as Workspace;
};

export interface UseWorkspaceReturn {
  /** Current workspace */
  workspace: Workspace | null;
  /** Loading states */
  isLoading: boolean;
  isTransitioning: boolean;
  isRefreshing: boolean;
  /** Error state */
  error: Error | null;
  /** Access control */
  canAccess: boolean;
  isActive: boolean;
  /** Workspace operations */
  switchWorkspace: (workspaceId: string) => Promise<void>;
  refreshWorkspace: () => Promise<void>;
  validateWorkspace: () => void;
  /** Permission checks */
  hasPermission: (permission: WorkspacePermissionType) => boolean;
  hasAllPermissions: (permissions: WorkspacePermissionType[]) => boolean;
  /** State persistence */
  persistWorkspaceState: () => Promise<void>;
  restoreWorkspaceState: () => Promise<void>;
}

export const useWorkspace = (workspaceId: string): UseWorkspaceReturn => {
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    workspace,
    isLoading,
    isTransitioning,
    setWorkspace,
    persistWorkspaceState,
    restoreWorkspaceState,
    transitionWorkspace
  } = useWorkspaceState();

  const {
    hasWorkspacePermission: hasPermission,
    validatePermissions: validateWorkspacePermissions
  } = useWorkspacePermissions(workspaceId);

  const hasAllPermissions = useCallback(
    (permissions: WorkspacePermissionType[]) => {
      return permissions.every(hasPermission);
    },
    [hasPermission]
  );

  const validateWorkspace = useCallback(() => {
    try {
      if (!workspace) {
        throw new AuthError(
          'Workspace not found',
          AuthErrorCode.WORKSPACE_ACCESS_DENIED
        );
      }
      if (workspace.status !== WorkspaceStatus.ACTIVE) {
        throw new AuthError(
          'Workspace is inactive',
          AuthErrorCode.WORKSPACE_ACCESS_DENIED
        );
      }
      validateWorkspacePermissions();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Workspace validation failed');
      setError(error);
      toast.error(error.message);
      throw error;
    }
  }, [workspace, validateWorkspacePermissions]);

  const switchWorkspace = useCallback(
    async (targetWorkspaceId: string): Promise<void> => {
      try {
        const newWorkspace = await fetchWorkspace(targetWorkspaceId);
        await transitionWorkspace(newWorkspace);
        toast.success('Successfully switched workspace');
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to switch workspace');
        setError(error);
        toast.error(error.message);
        throw error;
      }
    },
    [transitionWorkspace]
  );

  const refreshWorkspace = useCallback(async (): Promise<void> => {
    if (!workspace?.id) return;

    setIsRefreshing(true);
    try {
      const refreshed = await fetchWorkspace(workspace.id);
      setWorkspace(refreshed);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to refresh workspace');
      setError(error);
      toast.error(error.message);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [workspace?.id, setWorkspace]);

  const canAccess = Boolean(
    workspace && hasAllPermissions([WorkspacePermissionType.READ])
  );
  const isActive = workspace?.status === WorkspaceStatus.ACTIVE;

  return {
    workspace,
    isLoading,
    isTransitioning,
    isRefreshing,
    error,
    canAccess,
    isActive,
    switchWorkspace,
    refreshWorkspace,
    validateWorkspace,
    hasPermission,
    hasAllPermissions,
    persistWorkspaceState,
    restoreWorkspaceState
  };
};
