'use client';

import * as React from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { useClientTableFilters } from './useClientTableFilters';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
] as const;

interface ClientLocationTableProps {
  data: any[];
  totalData: number;
}

const ClientLocationTable = ({ data, totalData }: ClientLocationTableProps) => {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    page,
    setPage: handlePageChange
  } = useClientTableFilters();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    handlePageChange(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
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
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable
        columns={columns}
        data={data}
        pageCount={Math.ceil(totalData / 10)}
      />
    </div>
  );
};

export default ClientLocationTable;
