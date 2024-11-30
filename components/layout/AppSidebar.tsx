'use client';

import * as React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarRail } from '@/components/ui/sidebar';
import { SessionProvider } from 'next-auth/react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher/components/WorkspaceSwitcher';
import { useClient } from './ClientSwitcher/hooks/useClient';
import { ClientProvider } from './ClientSwitcher/contexts/ClientContext';
import { WorkspaceHeader } from './WorkspaceSwitcher/components/WorkspaceHeader';
import { WorkspaceProvider, useWorkspace } from './WorkspaceSwitcher';
import { FavoriteClients } from './FavoriteClients/components/FavoriteClients';
import { ClientHeader } from './ClientSwitcher/components/ClientHeader';
import { Navigation } from './Navigation';
import { mockSession, fakeClients } from '@/constants/mock-api';
import { UserNav } from './UserNav';
import { workspaceNavItems, noWorkspaceNavItems, clientNavItems } from '@/constants/navigation';
import { useCollapsedState } from './Navigation/hooks/useCollapsedState';

const AppSidebarContent = () => {
  const { isCollapsed } = useCollapsedState();
  const { selectedClient, setSelectedClient } = useClient();
  const { workspace } = useWorkspace();

  const handleFavoriteClick = (clientId: string) => {
    const client = fakeClients.records.find(c => c.id === clientId) || null;
    setSelectedClient(client);
  };

  const navigationItems = React.useMemo(() => {
    if (!workspace) {
      return noWorkspaceNavItems;
    }
    if (selectedClient) {
      return clientNavItems;
    }
    return workspaceNavItems;
  }, [workspace, selectedClient]);

  return (
    <>
      <SidebarHeader className="p-0 select-none">
        <WorkspaceHeader />
        <WorkspaceSwitcher session={mockSession} />
        {selectedClient ? (
          <ClientHeader 
            client={selectedClient}
            workspaceName="Selected Client"
            showBackButton={true}
            className="mb-4"
          />
        ) : (
          <FavoriteClients 
            clients={fakeClients.records}
            onClientClick={handleFavoriteClick} 
          />
        )}
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between overflow-x-hidden select-none">
        <div className="space-y-4">
          <Navigation 
            items={navigationItems}
            isCollapsed={isCollapsed}
          />
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

// Filter workspaceNavItems to only include items of type 'item'
const clientNavigationItems = workspaceNavItems.filter(
  (item): item is Extract<typeof item, { type: 'item' }> => item.type === 'item'
);

export const AppSidebar = () => (
  <SessionProvider session={mockSession}>
    <WorkspaceProvider>
      <ClientProvider navigationItems={clientNavigationItems}>
        <Sidebar collapsible="icon">
          <AppSidebarContent />
        </Sidebar>
      </ClientProvider>
    </WorkspaceProvider>
  </SessionProvider>
);
