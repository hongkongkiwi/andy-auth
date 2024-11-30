'use client';

import { useWorkspace } from '../contexts/WorkspaceContext';
import { WorkspaceLogoIcon } from './WorkspaceLogo';
import { cn } from '@/lib/utils';

export const WorkspaceHeader = () => {
  const { selectedWorkspace } = useWorkspace();

  if (!selectedWorkspace) return null;

  return (
    <div className="px-4 py-1.5 border-b">
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex size-5 items-center justify-center rounded-lg",
          selectedWorkspace.logo.backgroundColor
        )}>
          <WorkspaceLogoIcon 
            logo={selectedWorkspace.logo} 
            className="size-3 text-white"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-tight">{selectedWorkspace.name}</span>
          <span className="text-xs text-muted-foreground leading-tight">{selectedWorkspace.plan}</span>
        </div>
      </div>
    </div>
  );
}; 