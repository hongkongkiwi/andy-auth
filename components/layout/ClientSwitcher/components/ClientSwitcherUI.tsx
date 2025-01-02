'use client';

import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-react';
import type { RouterOutputs } from '@/lib/trpc/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ClientAvatar } from './ClientAvatar';
import { ScrollArea } from '@/components/ui/scroll-area';

type Client = RouterOutputs['clients']['list'][0];

interface ClientSwitcherUIProps {
  clients: Client[];
  selectedClient?: Client;
  onClientSelect: (client: Client | undefined) => void;
  showNoSelection?: boolean;
}

export const ClientSwitcherUI = ({
  clients,
  selectedClient,
  onClientSelect,
  showNoSelection = true
}: ClientSwitcherUIProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          {selectedClient ? (
            <div className="flex items-center gap-2">
              <ClientAvatar
                src={selectedClient.imageUrl ?? undefined}
                alt={selectedClient.displayName}
                size="sm"
              />
              <span className="truncate">{selectedClient.displayName}</span>
            </div>
          ) : (
            'Select client...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <ScrollArea className="h-[200px]">
          {showNoSelection && (
            <>
              <DropdownMenuItem onClick={() => onClientSelect(undefined)}>
                No selection
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {clients.map((client) => (
            <DropdownMenuItem
              key={client.id}
              onClick={() => onClientSelect(client)}
            >
              <div className="flex items-center gap-2">
                <ClientAvatar
                  src={client.imageUrl ?? undefined}
                  alt={client.displayName}
                  size="sm"
                />
                <span className="truncate">{client.displayName}</span>
              </div>
              {selectedClient?.id === client.id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
