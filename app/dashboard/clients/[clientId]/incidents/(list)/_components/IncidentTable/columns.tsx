'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { Incident } from '@/constants/mock-api/types';
import { CellAction } from './CellAction';

export const columns: ColumnDef<Incident>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'open'
              ? 'destructive'
              : status === 'in_progress'
                ? 'default'
                : 'secondary'
          }
        >
          {status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      return (
        <Badge
          variant={
            priority === 'high'
              ? 'destructive'
              : priority === 'medium'
                ? 'default'
                : 'secondary'
          }
        >
          {priority}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString();
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
