import { create } from 'zustand';
import type { AuthState } from '../types/auth';
import type { Workspace } from '../types/workspace';
import type { Client } from '../types/client';
import { AuthMethod } from '../types/auth';

interface AuthStore extends AuthState {
  setError: (error: Error | null) => void;
  setLoading: (isLoading: boolean) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setCurrentClient: (client: Client | null) => void;
  authMethod: AuthMethod;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoading: false,
  error: null,
  currentWorkspace: null,
  currentClient: null,
  authMethod: AuthMethod.EMAIL,
  setError: (error: Error | null) => set({ error }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setCurrentWorkspace: (workspace: Workspace | null) =>
    set({
      currentWorkspace: workspace,
      currentClient: null
    }),
  setCurrentClient: (client: Client | null) =>
    set((state) => {
      if (
        client &&
        (!state.currentWorkspace ||
          state.currentWorkspace.id !== client.workspaceId)
      ) {
        return state; // Don't update if workspace doesn't match
      }
      return { currentClient: client };
    })
}));
