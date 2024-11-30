'use client';

import React, { createContext, useContext } from 'react';
import type { Workspace, WorkspaceContextType } from '../types';
import type { NavigationItem } from '@/components/layout/Navigation/types';
import { workspaceNavItems as defaultWorkspaceItems } from '@/constants/navigation';

const WorkspaceContext = createContext<WorkspaceContextType>({
  selectedWorkspace: null,
  setSelectedWorkspace: () => {},
  isTransitioning: false,
  setIsTransitioning: () => {},
  workspaceNavItems: defaultWorkspaceItems,
  setWorkspaceNavItems: () => {},
  workspace: true,
});

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [workspaceNavItems, setWorkspaceNavItems] = React.useState<NavigationItem[]>(defaultWorkspaceItems);
  const [workspace] = React.useState(true);
  
  return (
    <WorkspaceContext.Provider value={{ 
      selectedWorkspace, 
      setSelectedWorkspace,
      isTransitioning, 
      setIsTransitioning,
      workspaceNavItems,
      setWorkspaceNavItems,
      workspace
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
}; 