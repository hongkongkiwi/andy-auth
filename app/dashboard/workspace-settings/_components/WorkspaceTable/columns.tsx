'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Workspace } from '@/constants/mock-api/types';
import { Checkbox } from '@/components/ui/checkbox';
import { CellAction } from './CellAction';

export const columns: ColumnDef<Workspace>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="w-[24px]">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[24px]">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 24
  },
  {
    accessorKey: 'displayName',
    header: 'NAME',
    size: 200
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    size: 250
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 70
  }
];
