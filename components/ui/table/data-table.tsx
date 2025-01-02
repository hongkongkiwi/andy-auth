'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  RowSelectionState,
  OnChangeFn
} from '@tanstack/react-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  onRowClick?: (row: TData) => void;
  selection?: {
    enabled: boolean;
    state: RowSelectionState;
    onChange: OnChangeFn<RowSelectionState>;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  onRowClick,
  selection
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: pageCount,
    manualPagination: true,
    enableRowSelection: selection?.enabled,
    state: {
      rowSelection: selection?.state || {}
    },
    onRowSelectionChange: selection?.onChange
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {selection?.enabled && <col style={{ width: '40px' }} />}
            {columns.map((col, i) => (
              <col key={i} width={col.size ? `${col.size}px` : 'auto'} />
            ))}
          </colgroup>
          <thead className="border-b bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className="cursor-pointer border-b hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
