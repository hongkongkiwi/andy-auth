'use client';

import { createContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { NavigationItem, ClientContextType } from '../types';
import type { Client } from '@/constants/mock-api';

export const ClientContext = createContext<ClientContextType | null>(null);

export const ClientProvider: React.FC<{ 
  children: ReactNode;
  navigationItems: NavigationItem[];
}> = ({ children, navigationItems = [] }) => {
  const [mounted, setMounted] = useState(false);
  const [selectedClient, setSelectedClientState] = useState<Client | null>(null);
  const [clientNavItems, setClientNavItems] = useState<NavigationItem[]>(navigationItems);
  
  const setSelectedClient = useCallback((client: Client | null) => {
    setSelectedClientState(client);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('selectedClient');
    if (stored) {
      setSelectedClient(JSON.parse(stored));
    }
    setMounted(true);
  }, [setSelectedClient]);

  useEffect(() => {
    if (!mounted) return;
    
    if (selectedClient) {
      localStorage.setItem('selectedClient', JSON.stringify(selectedClient));
      document.title = `${selectedClient.name} - Dashboard`;
      
      const updatedNavItems = navigationItems.map(item => ({
        ...item,
        href: item.href ? item.href.replace('/client/', `/client/${selectedClient.id}/`) : `/client/${selectedClient.id}/overview`
      }));
      setClientNavItems(updatedNavItems);
    } else {
      localStorage.removeItem('selectedClient');
      document.title = 'Dashboard';
      setClientNavItems(navigationItems || []);
    }

    return () => {
      document.title = 'Dashboard';
    };
  }, [selectedClient, mounted, navigationItems]);

  const value = {
    selectedClient,
    setSelectedClient,
    clientNavItems,
    setClientNavItems
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};