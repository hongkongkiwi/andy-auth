'use client';

import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClientSwitcherProps } from '../types';
import { ClientAvatar } from './ClientAvatar';

type SwitcherButtonProps = {
  selectedClient: ClientSwitcherProps['selectedClient'];
  open?: boolean;
  className?: string;
};

export const SwitcherButton = ({
  selectedClient,
  open = false,
  className
}: SwitcherButtonProps) => {
  return (
    <div className="w-full">
      <Button
        variant="ghost"
        type="button"
        className={cn('w-full justify-between px-4 py-2', className)}
      >
        {selectedClient ? (
          <div className="flex items-center gap-2">
            <ClientAvatar
              src={selectedClient.imageUrl}
              alt={selectedClient.name}
              size="sm"
            />
            <span>{selectedClient.name}</span>
          </div>
        ) : (
          'Select client...'
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </div>
  );
};
