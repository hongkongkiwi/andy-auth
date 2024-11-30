import type { LucideIcon } from 'lucide-react';
import type { NavigationItem } from '@/components/layout/Navigation/types';

type BaseWorkspaceLogo = {
  backgroundColor: string;
  textColor?: string;
};

type IconWorkspaceLogo = BaseWorkspaceLogo & {
  type: 'icon';
  icon: LucideIcon;
};

type ImageWorkspaceLogo = BaseWorkspaceLogo & {
  type: 'image';
  imageUrl: string;
  alt?: string;
};

export type WorkspaceLogo = IconWorkspaceLogo | ImageWorkspaceLogo;

export type Workspace = {
  id: string;
  name: string;
  logo: WorkspaceLogo;
  plan: string;
  style?: {
    transitionColor?: string;
    transitionTime?: number;
  }
};

export type WorkspaceContextType = {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
  workspaceNavItems: NavigationItem[];
  setWorkspaceNavItems: (items: NavigationItem[]) => void;
  workspace: boolean;
};
