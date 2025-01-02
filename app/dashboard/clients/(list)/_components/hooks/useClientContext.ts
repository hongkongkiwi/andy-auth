'use client';

import { ClientContext } from '@/components/layout/ClientSwitcher/contexts/ClientContext';
import { useContext } from 'react';

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};
