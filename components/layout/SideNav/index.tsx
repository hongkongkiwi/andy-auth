'use client';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname } from 'next/navigation';
import { useClient } from '../ClientSwitcher/hooks/useClient';
import { Navigation } from '../Navigation';
import {
  mainNav,
  clientNavItems,
  type NavigationItem
} from '@/constants/navigation';
import { useCollapsedState } from './hooks/useCollapsedState';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ClientSwitcher } from '../ClientSwitcher/components/ClientSwitcher';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher/components/WorkspaceSwitcher';
import { useWorkspace } from '../WorkspaceSwitcher';
import { db } from '@/constants/mock-api/db';
import { useEffect, useState } from 'react';
import type { Client } from '@/constants/mock-api/types';
import type {
  NavigationItem as NavItem,
  NavigationLink
} from '../Navigation/types';
import type { IconsType } from '@/components/ui/icons';

const ensureHref = (href: string | undefined, defaultHref: string = '#') =>
  href || defaultHref;

// Helper function to transform navigation items
const transformNavItem = (item: NavigationItem): NavItem => {
  const baseItem = {
    id: item.href || item.title,
    type: 'item' as const,
    title: item.title || 'Untitled',
    href: ensureHref(item.href)
  };

  // Only add icon if it exists
  if (item.icon) {
    const iconName = item.icon.displayName || item.icon.name;
    const iconId = iconName?.toLowerCase().replace('icon', '') as IconsType;
    if (iconId) {
      return {
        ...baseItem,
        icon: iconId
      };
    }
  }

  return baseItem;
};

export const SideNav = () => {
  const pathname = usePathname();
  const { selectedClient, handleClientSwitch } = useClient();
  const { selectedWorkspace } = useWorkspace();
  const { isCollapsed, toggleCollapsed } = useCollapsedState();
  const [workspaceClients, setWorkspaceClients] = useState<Client[]>([]);

  // Fetch clients when workspace changes
  useEffect(() => {
    const fetchClients = async () => {
      if (selectedWorkspace) {
        const clients = await db.client.findMany({
          where: { workspaceId: selectedWorkspace.id }
        });
        setWorkspaceClients(clients);
      } else {
        setWorkspaceClients([]);
      }
    };

    fetchClients();
  }, [selectedWorkspace]);

  // Get the appropriate navigation items based on context
  const getNavigationItems = (): NavItem[] => {
    // If no workspace is selected, show no navigation
    if (!selectedWorkspace) return [];

    // If a client is selected, show client navigation
    if (selectedClient) {
      return (clientNavItems || []).map((item) => ({
        ...transformNavItem(item),
        href: ensureHref(item.href?.replace(':clientId', selectedClient.id))
      }));
    }

    // Otherwise, show workspace navigation
    return (mainNav || []).map(transformNavItem);
  };

  const transformedNavItems = getNavigationItems();
  const showClientSelector = !!selectedWorkspace;

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-r bg-background',
        isCollapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      {!isCollapsed && (
        <div className="sticky top-0 z-20 border-b bg-background">
          <div className="p-4">
            <WorkspaceSwitcher />
          </div>
        </div>
      )}
      <ScrollArea className="flex-1">
        {showClientSelector && !isCollapsed && (
          <div className="border-b bg-background">
            <div className="p-4">
              <ClientSwitcher
                clients={workspaceClients}
                selectedClient={selectedClient}
                onClientSelect={handleClientSwitch}
                showNoSelection={true}
              />
            </div>
          </div>
        )}
        <Navigation items={transformedNavItems} isCollapsed={isCollapsed} />
      </ScrollArea>
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-2"
        onClick={toggleCollapsed}
      >
        <ChevronLeft
          className={cn(
            'h-4 w-4 transition-transform',
            isCollapsed && 'rotate-180'
          )}
        />
      </Button>
    </div>
  );
};
