'use client';

import { createContext, useContext, useState } from 'react';
import { api, type RouterOutputs } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import type { ClientContextType, ClientFromAPI } from '../types';

export const ClientContext = createContext<ClientContextType | undefined>(
  undefined
);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedClient, setSelectedClient] = useState<ClientFromAPI>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClientSwitch = async (client: ClientFromAPI | undefined) => {
    setIsLoading(true);
    try {
      setSelectedClient(client);
      if (client) {
        await router.push(`/dashboard/clients/${client.id}`);
      } else {
        await router.push('/dashboard/clients');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    selectedClient,
    setSelectedClient,
    handleClientSwitch,
    isLoading
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
