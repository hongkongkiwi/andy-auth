'use client';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { ColumnDef } from '@tanstack/react-table';

interface ClientLocation {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export const columns: ColumnDef<ClientLocation>[] = [
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
    accessorKey: 'type',
    header: 'TYPE',
    cell: ({ row }) => (
      <div className="pl-2 capitalize">{row.original.type}</div>
    ),
    size: 100
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
    accessorKey: 'address',
    header: 'ADDRESS',
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <div className="pl-2">
          {`${address.street}, ${address.city}, ${address.state} ${address.zip}`}
        </div>
      );
    },
    size: 300
  }
];
