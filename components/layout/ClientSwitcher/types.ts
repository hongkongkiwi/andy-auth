import type { Client, Workspace } from '@/constants/mock-api';
import type { NavigationItem as SharedNavigationItem } from '../Navigation/types';

export type PartialClient = Pick<Client, 'id' | 'name' | 'imageUrl'> & {
  workspace: Pick<Workspace, 'id' | 'displayName'>;
};

export type ClientAvatarProps = {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md';
  className?: string;
};

export type ClientSwitcherProps = {
  clients: Client[];
  selectedClient: Client | null;
  onClientSelect: (client: Client | null) => void;
  navigationItems: NavigationItem[];
  className?: string;
};

export type ClientHeaderProps = {
  client: Client;
  workspaceName: string;
  showWorkspaceName?: boolean;
  showBackButton?: boolean;
  className?: string;
  headerText?: string;
};

export type NavigationItem = Extract<SharedNavigationItem, { type: 'item' }> & {
  href: string;
};

export type ClientContextType = {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  clientNavItems: NavigationItem[];
  setClientNavItems: (items: NavigationItem[]) => void;
};
