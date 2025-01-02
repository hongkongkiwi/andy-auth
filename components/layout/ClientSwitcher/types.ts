import type { RouterOutputs } from '@/lib/trpc/client';
import type { NavigationItem } from '@/components/layout/Navigation/types';

export type ClientFromAPI = RouterOutputs['clients']['list'][0];

export interface ClientContextType {
  selectedClient: ClientFromAPI | undefined;
  setSelectedClient: (client: ClientFromAPI | undefined) => void;
  handleClientSwitch: (client: ClientFromAPI | undefined) => Promise<void>;
  isLoading: boolean;
}

export interface ClientHeaderProps {
  client: ClientFromAPI;
  workspaceName?: string;
  showWorkspaceName?: boolean;
  showBackButton?: boolean;
  className?: string;
  headerText?: string;
}
