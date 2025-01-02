'use client';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Guard } from '@/constants/mock-api/types';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './CellAction';

export const columns: ColumnDef<Guard>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex w-[24px] items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-[24px] items-center justify-center">
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
    accessorKey: 'phone',
    header: 'PHONE',
    cell: ({ row }) => <div className="pl-2">{row.original.phone}</div>,
    size: 150
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const variantMap = {
        active: 'default',
        inactive: 'secondary',
        on_leave: 'destructive',
        suspended: 'destructive'
      } as const;

      return (
        <div className="pl-2">
          <Badge
            variant={variantMap[row.original.status]}
            className="capitalize"
          >
            {row.original.status.replace('_', ' ')}
          </Badge>
        </div>
      );
    },
    size: 120
  },
  {
    accessorKey: 'gender',
    header: 'GENDER',
    cell: ({ row }) => (
      <div className="pl-2 capitalize">{row.original.gender}</div>
    ),
    size: 100
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
