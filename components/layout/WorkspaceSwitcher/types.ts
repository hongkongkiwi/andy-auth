import type { RouterOutputs } from '@/lib/trpc/client';
import type { NavigationItem } from '@/components/layout/Navigation/types';

export type WorkspaceFromAPI = RouterOutputs['workspaces']['list'][0];

export interface WorkspaceContextType {
  selectedWorkspace: WorkspaceFromAPI | null;
  setSelectedWorkspace: (workspace: WorkspaceFromAPI | null) => void;
  handleWorkspaceSwitch: (workspace: WorkspaceFromAPI) => Promise<void>;
  isLoading: boolean;
}
