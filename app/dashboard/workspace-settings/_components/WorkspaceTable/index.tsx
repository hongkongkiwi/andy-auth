'use client';

import { DataTable } from '@/components/ui/table/data-table';
import type { Workspace } from '@/constants/mock-api/types';
import { columns } from './columns';

export default function WorkspaceTable({
  data,
  totalData
}: {
  data: Workspace[];
  totalData: number;
}) {
  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        pageCount={Math.ceil(totalData / 10)}
      />
    </div>
  );
}
