'use client';

import { useCallback } from 'react';
import { useAuthStore } from '../stores/auth-store';
import type { Workspace } from '../types';

export const useWorkspacePersistence = () => {
  const { setCurrentWorkspace, clearWorkspaceState } = useAuthStore();

  const persistWorkspaceState = useCallback(
    async (workspace: Workspace) => {
      try {
        setCurrentWorkspace(workspace);
        localStorage.setItem('workspace_state', JSON.stringify({ workspace }));
      } catch (error) {
        console.error('Failed to persist workspace state:', error);
      }
    },
    [setCurrentWorkspace]
  );

  const clearPersistedWorkspace = useCallback(() => {
    try {
      clearWorkspaceState();
      localStorage.removeItem('workspace_state');
    } catch (error) {
      console.error('Failed to clear workspace state:', error);
    }
  }, [clearWorkspaceState]);

  return { persistWorkspaceState, clearPersistedWorkspace };
};
