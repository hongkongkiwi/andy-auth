'use client';

import { api } from '@/lib/trpc/client';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import { useClient } from '../hooks/useClient';
import { ClientSwitcherUI } from './ClientSwitcherUI';

export const ClientSwitcher = () => {
  const { selectedWorkspace } = useWorkspace();
  const { selectedClient, setSelectedClient } = useClient();

  const { data: clients = [], isLoading } = api.clients.list.useQuery(
    { workspaceId: selectedWorkspace?.id ?? '' },
    { enabled: !!selectedWorkspace?.id }
  );

  if (!selectedWorkspace || isLoading) return null;

  return (
    <ClientSwitcherUI
      clients={clients}
      selectedClient={selectedClient}
      onClientSelect={setSelectedClient}
      showNoSelection
    />
  );
};
