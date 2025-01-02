'use client';

import { useContext } from 'react';
import { ClientContext } from '../contexts/ClientContext';
import { useWorkspace } from '@/components/layout/WorkspaceSwitcher';
import { usePathname, useRouter } from 'next/navigation';

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }

  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();
  const router = useRouter();
  const pathname = usePathname();

  return {
    ...context,
    selectedWorkspace,
    setSelectedWorkspace
  };
};
