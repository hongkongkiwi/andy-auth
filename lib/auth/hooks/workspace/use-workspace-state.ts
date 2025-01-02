'use client';

import { useCallback, useState } from 'react';
import { useAuthStore } from '@/lib/auth/stores/auth-store';
import type { Workspace } from '@/lib/auth/types';
import { useRouter } from 'next/router';
import { AuthError, AuthErrorCode } from '@/lib/auth/errors';
import { toast } from 'sonner';

export interface UseWorkspaceStateReturn {
  /** Current workspace */
  workspace: Workspace | null;
  /** Loading states */
  isLoading: boolean;
  isTransitioning: boolean;
  /** Workspace operations */
  setWorkspace: (workspace: Workspace | null) => void;
  clearWorkspaceState: () => void;
  transitionWorkspace: (workspace: Workspace | null) => Promise<void>;
  /** State persistence */
  persistWorkspaceState: () => Promise<void>;
  restoreWorkspaceState: () => Promise<void>;
  /** Navigation */
  navigateToWorkspace: (workspace: Workspace | null, path?: string) => void;
}

export const useWorkspaceState = (): UseWorkspaceStateReturn => {
  const {
    setCurrentWorkspace: setStoreWorkspace,
    currentWorkspace: storeWorkspace,
    isLoading
  } = useAuthStore();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const setWorkspace = useCallback(
    (workspace: Workspace | null): void => {
      setStoreWorkspace(workspace);
    },
    [setStoreWorkspace]
  );

  const clearWorkspaceState = useCallback((): void => {
    setStoreWorkspace(null);
    localStorage.removeItem('lastWorkspace');
    toast.success('Workspace state cleared');
  }, [setStoreWorkspace]);

  const persistWorkspaceState = useCallback(async (): Promise<void> => {
    if (!storeWorkspace) return;

    try {
      localStorage.setItem('lastWorkspace', JSON.stringify(storeWorkspace));
    } catch (error) {
      const err = new AuthError(
        'Failed to persist workspace state',
        AuthErrorCode.WORKSPACE_STATE_ERROR
      );
      toast.error(err.message);
      throw err;
    }
  }, [storeWorkspace]);

  const restoreWorkspaceState = useCallback(async (): Promise<void> => {
    try {
      const stored = localStorage.getItem('lastWorkspace');
      if (stored) {
        const workspace = JSON.parse(stored) as Workspace;
        setStoreWorkspace(workspace);
      }
    } catch (error) {
      const err = new AuthError(
        'Failed to restore workspace state',
        AuthErrorCode.WORKSPACE_STATE_ERROR
      );
      toast.error(err.message);
      throw err;
    }
  }, [setStoreWorkspace]);

  const navigateToWorkspace = useCallback(
    (workspace: Workspace | null, path = '/') => {
      setStoreWorkspace(workspace);
      if (workspace) {
        router.push(`/workspaces/${workspace.id}${path}`);
      } else {
        router.push('/workspaces');
      }
    },
    [router, setStoreWorkspace]
  );

  const transitionWorkspace = useCallback(
    async (workspace: Workspace | null): Promise<void> => {
      setIsTransitioning(true);
      try {
        setStoreWorkspace(workspace);
        await persistWorkspaceState();
      } finally {
        setIsTransitioning(false);
      }
    },
    [setStoreWorkspace, persistWorkspaceState]
  );

  return {
    workspace: storeWorkspace,
    isLoading,
    isTransitioning,
    setWorkspace,
    clearWorkspaceState,
    transitionWorkspace,
    persistWorkspaceState,
    restoreWorkspaceState,
    navigateToWorkspace
  };
};
