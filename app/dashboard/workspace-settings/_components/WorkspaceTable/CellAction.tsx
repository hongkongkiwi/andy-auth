'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import type { Workspace } from '@/constants/mock-api/types';

interface CellActionProps {
  data: Workspace;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/dashboard/workspace-settings/${data.id}`)
          }
        >
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
