'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './CellAction';
import type { User } from '@/constants/mock-api/types';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 4
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({ row }) => <div className="pl-2">{row.original.name}</div>,
    size: 200
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ row }) => <div className="pl-2">{row.original.email}</div>,
    size: 280
  },
  {
    accessorKey: 'role',
    header: 'ROLE',
    cell: ({ row }) => (
      <div className="pl-2">
        <Badge variant="outline" className="capitalize">
          {row.original.role}
        </Badge>
      </div>
    ),
    size: 120
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const variantMap = {
        active: 'default',
        inactive: 'secondary'
      } as const;

      return (
        <div className="pl-2">
          <Badge
            variant={variantMap[row.original.status]}
            className="capitalize"
          >
            {row.original.status}
          </Badge>
        </div>
      );
    },
    size: 120
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="pr-4">
        <CellAction data={row.original} />
      </div>
    ),
    size: 48
  }
];
