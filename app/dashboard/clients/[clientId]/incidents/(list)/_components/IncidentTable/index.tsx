'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import type { Incident } from '@/constants/mock-api/types';
import { columns } from './columns';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  useIncidentTableFilters
} from './useIncidentTableFilters';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';

export default function IncidentTable({
  data,
  totalData
}: {
  data: Incident[];
  totalData: number;
}): ReactElement {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useIncidentTableFilters();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="title"
          searchQuery={searchQuery || ''}
          onSearch={handleSearch}
        />
        <DataTableFilterBox
          filterKey="status"
          title="Status"
          options={STATUS_OPTIONS}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter || ''}
        />
        <DataTableFilterBox
          filterKey="priority"
          title="Priority"
          options={PRIORITY_OPTIONS}
          setFilterValue={setPriorityFilter}
          filterValue={priorityFilter || ''}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        pageCount={Math.ceil(totalData / 10)}
        selection={{
          enabled: true,
          state: rowSelection,
          onChange: setRowSelection
        }}
      />
    </div>
  );
}
