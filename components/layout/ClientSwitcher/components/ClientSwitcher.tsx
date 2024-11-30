'use client';

import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClientAvatar } from './ClientAvatar';
import type { ClientSwitcherProps } from '../types';
import { SwitcherButton } from './SwitcherButton';

export const ClientSwitcher = ({ 
  clients, 
  selectedClient, 
  onClientSelect, 
  className 
}: ClientSwitcherProps) => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseButton = (
    <SwitcherButton 
      selectedClient={selectedClient}
      className={className}
    />
  );

  if (!mounted) {
    return baseButton;
  }

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <SwitcherButton 
              selectedClient={selectedClient}
              open={open}
              className={className}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search clients..." />
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  onSelect={() => {
                    onClientSelect(client);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <ClientAvatar 
                      src={client.imageUrl} 
                      alt={client.name} 
                      size="sm"
                    />
                    <span>{client.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}; 