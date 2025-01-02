'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarProvider
} from '@/components/ui/sidebar';
import { WorkspaceSwitcher } from './WorkspaceSwitcher/components/WorkspaceSwitcher';
import { useClient } from './ClientSwitcher/hooks/useClient';
import { WorkspaceHeader } from './WorkspaceSwitcher/components/WorkspaceHeader';
import { useWorkspace } from './WorkspaceSwitcher';
import { FavoriteClients } from './FavoriteClients/components/FavoriteClients';
import { ClientHeader } from './ClientSwitcher/components/ClientHeader';
import { Navigation } from './Navigation';
import { UserNav } from './UserNav';
import {
  workspaceNavItems,
  noWorkspaceNavItems,
  clientNavItems
} from '@/constants/navigation';
import { useCollapsedState } from './Navigation/hooks/useCollapsedState';
import type { NavigationItem } from '@/constants/types';
import { api } from '@/lib/trpc/client';
import { ClientSwitcher } from './ClientSwitcher/components/ClientSwitcher';
import type { Workspace } from '@prisma/client';

interface Client {
  id: string;
  displayName: string;
  imageUrl: string | null;
  workspace: {
    id: string;
    displayName: string;
  };
  timezone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const AppSidebar = () => {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebarContent />
      </Sidebar>
    </SidebarProvider>
  );
};

const AppSidebarContent = () => {
  const { isCollapsed } = useCollapsedState();
  const { selectedClient, setSelectedClient } = useClient();
  const { selectedWorkspace } = useWorkspace();

  const { data: clients = [] } = api.clients.list.useQuery(
    { workspaceId: selectedWorkspace?.id ?? '' },
    { enabled: !!selectedWorkspace?.id }
  );

  const transformedNavItems = React.useMemo(() => {
    const items = !selectedWorkspace
      ? noWorkspaceNavItems
      : selectedClient
        ? clientNavItems.map((item) => ({
            ...item,
            href: item.href.replace(':id', selectedClient.id)
          }))
        : workspaceNavItems;

    return items.map((item) => ({ ...item, type: 'item' as const }));
  }, [selectedWorkspace, selectedClient]);

  return (
    <>
      <SidebarHeader className="select-none p-0">
        <WorkspaceHeader />
        <WorkspaceSwitcher />
        {selectedWorkspace && (
          <>
            <ClientSwitcher />
            {selectedClient && (
              <ClientHeader
                client={selectedClient}
                workspaceName={selectedWorkspace.displayName}
                showBackButton={true}
                className="mb-4"
              />
            )}
          </>
        )}
      </SidebarHeader>

      <SidebarContent className="flex select-none flex-col justify-between overflow-x-hidden">
        <div className="space-y-4">
          <Navigation items={transformedNavItems} isCollapsed={isCollapsed} />
        </div>

        <SidebarFooter className="sticky bottom-0 mt-auto">
          <SidebarMenu>
            <UserNav />
          </SidebarMenu>
          <SidebarRail />
        </SidebarFooter>
      </SidebarContent>
    </>
  );
};
