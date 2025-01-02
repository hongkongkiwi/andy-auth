'use client';

import { useClient } from '../hooks/useClient';
import { ClientSwitcher } from './ClientSwitcher';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher/contexts/WorkspaceContext';

export const ClientSwitcherContainer = () => {
  const { selectedWorkspace } = useWorkspace();
  const { selectedClient, setSelectedClient, availableClients, isLoading } =
    useClient();

  if (!selectedWorkspace || isLoading) return null;

  return (
    <ClientSwitcher
      clients={availableClients}
      selectedClient={selectedClient}
      onClientSelect={setSelectedClient}
      showNoSelection
    />
  );
};
