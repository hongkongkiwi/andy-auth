'use client';

import React, { useState } from 'react';
import { Check, ChevronsUpDown, Search, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { WorkspaceLogoIcon } from './WorkspaceLogo';
import type { RouterOutputs } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/trpc/client';

type Workspace = RouterOutputs['workspaces']['list'][0];

export const WorkspaceSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { selectedWorkspace, handleWorkspaceSwitch } = useWorkspace();

  const { data: workspaces = [] } = api.workspaces.list.useQuery();

  if (!selectedWorkspace) return null;

  const filteredWorkspaces = workspaces.filter((workspace: Workspace) =>
    workspace.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-52 justify-between"
        >
          <div className="flex items-center gap-2">
            <WorkspaceLogoIcon
              workspace={selectedWorkspace}
              className="size-5"
            />
            <span className="truncate">{selectedWorkspace.displayName}</span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <div className="p-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspace..."
              className="h-8"
            />
          </div>
          <ScrollArea className="h-72">
            {filteredWorkspaces.map((workspace: Workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onSelect={async () => {
                  await handleWorkspaceSwitch(workspace);
                  setOpen(false);
                }}
                className="p-2"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <WorkspaceLogoIcon workspace={workspace} className="size-5" />
                  <span className="truncate">{workspace.displayName}</span>
                </div>
                {workspace.id === selectedWorkspace.id && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            router.push('/dashboard/workspace-settings');
            setOpen(false);
          }}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Workspace Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
