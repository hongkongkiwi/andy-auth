'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Device } from '@/constants/mock-api/types';
import { columns } from './columns';
import {
  STATUS_OPTIONS,
  TYPE_OPTIONS,
  useDeviceTableFilters
} from './useDeviceTableFilters';

interface DeviceTableProps {
  data: Device[];
  totalData: number;
}

export const DeviceTable = ({ data, totalData }: DeviceTableProps) => {
  const {
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useDeviceTableFilters();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        <DataTableFilterBox
          filterKey="type"
          title="Type"
          options={TYPE_OPTIONS}
          setFilterValue={setTypeFilter}
          filterValue={typeFilter}
        />
        <DataTableFilterBox
          filterKey="status"
          title="Status"
          options={STATUS_OPTIONS}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
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
