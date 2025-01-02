'use client';
import { Checkbox } from '@/components/ui/checkbox';
import type { ClientLocation } from '@/constants/mock-api/types';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './CellAction';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Create a separate component for the cell
const NameCell = ({ value, id }: { value: string; id: string }) => {
  const params = useParams();
  return (
    <Link
      href={`/dashboard/clients/${params.clientId}/locations/${id}`}
      className="text-primary hover:underline"
    >
      {value}
    </Link>
  );
};

export const columns: ColumnDef<ClientLocation>[] = [
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
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <NameCell value={row.original.name} id={row.original.id} />
    )
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    accessorKey: 'city',
    header: 'City'
  },
  {
    accessorKey: 'state',
    header: 'State'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === 'active' ? 'default' : 'destructive'}
      >
        {row.original.status}
      </Badge>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
