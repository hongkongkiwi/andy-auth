'use client';

import KBar from '@/components/kbar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ClientProvider } from '@/components/layout/ClientSwitcher/contexts/ClientContext';
import { useEffect, useState } from 'react';
import { clientNavItems } from '@/constants/data';

// Transform nav items to match NavigationItem type
const transformedNavItems = clientNavItems.map(item => ({
  id: item.title.toLowerCase(),
  type: 'item' as const,
  title: item.title,
  icon: item.icon,
  href: item.url
}));

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [defaultOpen, setDefaultOpen] = useState(true);

  useEffect(() => {
    const sidebarState = localStorage.getItem('sidebar:state');
    setDefaultOpen(sidebarState === 'true');
  }, []);
  
  return (
    <KBar>
      <ClientProvider navigationItems={transformedNavItems}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ClientProvider>
    </KBar>
  );
}
