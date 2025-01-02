'use client';

import { useSession } from 'next-auth/react';
import { useFindManyClient } from '@/lib/zenstack/hooks';
import { DataTable } from '@/components/ui/data-table';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { columns } from './columns';
import type { ClientTableData } from './types';
import type { RowData } from '@tanstack/react-table';

const ClientTable = () => {
  const { data: session } = useSession();
  const { data: clients, isLoading } = useFindManyClient({
    where: {
      workspace: {
        id: session?.user?.workspaceId
      }
    }
  });

  if (isLoading) {
    return <TableSkeleton columns={columns.length} rows={5} />;
  }

  return (
    <DataTable<ClientTableData, RowData>
      columns={columns}
      data={clients || []}
    />
  );
};

export default ClientTable;
