'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type RouterOutputs } from '@/lib/trpc/client';
import type { WorkspaceContextType, WorkspaceFromAPI } from '../types';

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export const WorkspaceProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<WorkspaceFromAPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleWorkspaceSwitch = async (workspace: WorkspaceFromAPI) => {
    setIsLoading(true);
    try {
      setSelectedWorkspace(workspace);
      await router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspace,
        setSelectedWorkspace,
        handleWorkspaceSwitch,
        isLoading
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
