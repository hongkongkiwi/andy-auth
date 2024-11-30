'use client';

import React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Session } from 'next-auth';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { WorkspaceLogoIcon } from './WorkspaceLogo';
import type { Workspace } from '../types';

// Mock data can be moved to a separate file if needed
const workspaces: Workspace[] = [
  {
    id: '1',
    name: 'TechCorp Global',
    logo: {
      type: 'image',
      imageUrl: '/logos/techcorp.png',
      alt: 'TechCorp Logo',
      backgroundColor: 'bg-blue-500',
      textColor: 'text-white',
    },
    style: {
      transitionColor: 'bg-blue-500/20',
      transitionTime: 1500
    },
    plan: 'Enterprise'
  }
];

type WorkspaceSwitcherProps = {
  session?: Session | null;
  alwaysShowSearch?: boolean;
  searchThreshold?: number;
};

const DEFAULT_TRANSITION_TIME = 1500;

const useWorkspaceTransition = () => {
  const { setIsTransitioning } = useWorkspace();
  
  return React.useCallback((transitionTime?: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionTime || DEFAULT_TRANSITION_TIME);
  }, [setIsTransitioning]);
};

export const WorkspaceSwitcher = ({ 
  session, 
  alwaysShowSearch = false,
  searchThreshold = 5
}: WorkspaceSwitcherProps) => {
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [opacity, setOpacity] = React.useState(0);
  const handleTransition = useWorkspaceTransition();
  const canCreateWorkspace = true;

  const filteredWorkspaces = React.useMemo(() => (
    workspaces.filter((workspace) =>
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ), [searchQuery]);

  const showSearch = alwaysShowSearch || workspaces.length > searchThreshold;

  const handleWorkspaceSelect = React.useCallback((workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setOpen(false);
    handleTransition(workspace.style?.transitionTime);
    setOpacity(1);
    
    const startTime = Date.now();
    const duration = workspace.style?.transitionTime || DEFAULT_TRANSITION_TIME;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 1 - (elapsed / duration));
      
      if (progress > 0) {
        setOpacity(progress);
        requestAnimationFrame(animate);
      } else {
        setOpacity(0);
      }
    };
    
    requestAnimationFrame(animate);
  }, [setSelectedWorkspace, handleTransition]);

  // If there's only one workspace, render simplified version
  if (workspaces.length === 1) {
    const workspace = workspaces[0];
    return (
      <div className="relative w-full">
        <div className="relative z-30 flex w-full items-center gap-2 rounded-lg py-2 text-sidebar-accent-foreground">
          <div className={cn(
            "flex size-8 items-center justify-center rounded-lg text-white",
            workspace.logo.backgroundColor
          )}>
            <WorkspaceLogoIcon 
              logo={workspace.logo} 
              className="size-4"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{workspace.name}</span>
            <span className="truncate text-xs text-muted-foreground">{workspace.plan}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={cn(
          "absolute inset-0 rounded-lg",
          selectedWorkspace?.style?.transitionColor || "bg-primary/20 dark:bg-primary/20"
        )}
        style={{ opacity }}
      />
      
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="relative w-full focus:outline-none">
            <div className="relative z-30 flex w-full items-center gap-2 rounded-lg py-2">
              {selectedWorkspace && (
                <div className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-white",
                  selectedWorkspace.logo.backgroundColor
                )}>
                  <WorkspaceLogoIcon 
                    logo={selectedWorkspace.logo} 
                    className="size-4"
                  />
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedWorkspace?.name || "Select Workspace"}
                </span>
                {selectedWorkspace && (
                  <span className="truncate text-xs text-muted-foreground">
                    {selectedWorkspace.plan}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-50" />
            </div>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-[300px]" align="start">
          {showSearch && (
            <div className="relative p-2">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-9"
              />
            </div>
          )}
          
          <ScrollArea className="h-[300px]">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium">
              Workspaces
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {filteredWorkspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => handleWorkspaceSelect(workspace)}
                  className="flex items-center gap-2 p-2"
                >
                  <div className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-white",
                    workspace.logo.backgroundColor
                  )}>
                    <WorkspaceLogoIcon 
                      logo={workspace.logo} 
                      className="size-4"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{workspace.name}</span>
                    <span className="text-xs text-muted-foreground">{workspace.plan}</span>
                  </div>
                  {selectedWorkspace?.id === workspace.id && (
                    <Check className="ml-auto size-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
          
          {canCreateWorkspace && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="p-2"
                onClick={() => {
                  setOpen(false);
                  // Handle create workspace
                }}
              >
                <span className="text-sm">Create New Workspace</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}; 