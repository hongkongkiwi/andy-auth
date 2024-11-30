'use client';

import { useContext } from 'react';
import { ClientContext } from '../contexts/ClientContext';
import { ClientContextType } from '../types';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import type { Client } from '@/constants/mock-api';

export const useClient = (): ClientContextType & {
  handleClientSwitch: (client: Client) => void;
} => {
  const context = useContext(ClientContext);
  const { selectedWorkspace: currentWorkspace, setSelectedWorkspace: switchWorkspace } = useWorkspace();
  
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  
  const handleClientSwitch = (client: Client) => {
    // First ensure we're in the correct workspace
    if (client.workspace.id !== currentWorkspace?.id) {
      switchWorkspace({
        ...client.workspace,
        name: client.workspace.displayName,
        logo: {
          type: 'image',
          imageUrl: '',
          backgroundColor: '#000000'
        },
        plan: 'free'
      });
    }
    
    // Then switch the client
    context.setSelectedClient(client);
  };
  
  return {
    ...context,
    handleClientSwitch,
  };
};