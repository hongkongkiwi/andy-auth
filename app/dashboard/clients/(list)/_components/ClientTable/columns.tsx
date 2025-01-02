'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './CellAction';
import type { ClientTableData } from './types';

export const columns: ColumnDef<ClientTableData>[] = [
  {
    accessorKey: 'displayName',
    header: 'Name'
  },
  {
    accessorKey: 'clientEmail',
    header: 'Email'
  },
  {
    accessorKey: 'clientPhoneNumber',
    header: 'Phone'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
