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
} from './useClientTableFilters';

export default function IncidentTable({
  data,
  totalData
}: {
  data: Incident[];
  totalData: number;
}) {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="title"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="status"
          title="Status"
          options={STATUS_OPTIONS}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        />
        <DataTableFilterBox
          filterKey="priority"
          title="Priority"
          options={PRIORITY_OPTIONS}
          setFilterValue={setPriorityFilter}
          filterValue={priorityFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
